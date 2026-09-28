
const express = require("express")
const app = express.Router()
const axios = require("axios")
const pool  = require("../db")
const circuitBreaker = require("../circuitBreaker")
const eventBus = require("../events/eventBus")
const publishOrderCreated = require("../messaging/publisher")


require("dotenv").config()



const processedRequests = new Map()

const productBreaker = new circuitBreaker(

     (productId) => axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/products/${productId}`,
        {
            timeout: 3000,


             headers: {
                "X-Service-Key": process.env.PRODUCTS_SERVICE_KEY
            }
            
        }
    )
)

app.get("/", async (req,res) => {

   return  res.status(200).json({
        message:"Fetching orders"
    })
    
})


app.get("/see", async(req,res) => {

    try {
        const response = await axios.get("http://localhost:3003/products")

        return res.json({
            message:"Products fetsching",
            data:response.data
        })
        
    } catch (error) {

        return res.json({
            message:error.message
        })
        
    }

})




async function getProduct(productId) {
    let attempts = 0;

    while (attempts < 3) {
        try {
            return await axios.get(
                `${process.env.PRODUCT_SERVICE_URL}/products/${productId}`,
                {
                    timeout: 3000
                }
            );
        } catch (error) {
            attempts++;

            console.log(`Product request failed. Attempt ${attempts}`);

            if (attempts === 3) {
                throw error;
            }
        }
    }
}






app.post("/", async (req,res) => {

    try {

        const  {customerId, productId, quantity} = req.body




         const idempotencyKey = req.headers["idempotency-key"]

        if(!idempotencyKey){
            return res.status(400).json({
                message: "Idempotency-Key header is required"

            })
        }

        if (processedRequests.has(idempotencyKey)) {
              console.log("Duplicate request detected:", idempotencyKey);
    return res.status(200).json({
        message: "Request already processed",
        order: processedRequests.get(idempotencyKey)
    });
}


        

         const customerResponse = await axios.get(
            `${process.env.CUSTOMER_SERVICE_URL}/customers/${customerId}`, {

                timeout:3000
            }
        );
    

        // const response =  await getProduct(productId)
        const productResponse = await productBreaker.execute(productId); 
        
         const customer = customerResponse.data
        const product = productResponse.data

        const total = product.price * quantity

       const result =  await pool.query(
        
        `
        INSERT INTO orders
        (customer_id, product_id, product_name, unit_price, quantity, total)
        VALUES($1, $2, $3, $4, $5, $6)

        RETURNING *
        
        `,
        [
        customer.id,
        product.id,
        product.name,
        product.price,
        quantity,
        total
        ]



       )

       const order = result.rows[0]


 await publishOrderCreated({
    orderId: order.id,
    customerId: order.customer_id,
    productId: order.product_id,
    total: order.total
})

        

processedRequests.set(idempotencyKey, order);

  console.log("New order created:", idempotencyKey);



         return res.status(201).json({
            message: "Order created",
            order: order
        });

        
    } catch (error) {

        if(error.code === "ECONNABBORTED"){
            return res.status(504).json({
               message:  "A required service took too long to respond"
            })
        }
        

        if (error.response) {
        return res.status(error.response.status).json({
            message: error.response.data.message
        });
    }

console.log(error)
        return res.status(503).json({
            message: "Products service is unavailable"
        });
        
    }
    
})

module.exports = app