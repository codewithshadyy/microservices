
const express = require("express")
const app = express.Router()
const axios = require("axios")


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


app.post("/", async (req,res) => {

    try {

        const  {customerId, productId, quantity} = req.body

         const customerResponse = await axios.get(
            `http://localhost:3004/customers/${customerId}`, {

                timeout:3000
            }
        );

        const response = await axios.get(
            `http://localhost:3003/products/${productId}`, {

                timeout:3000
            }
        )
         const customer = customerResponse.data
        const product = response.data

        const order = {
            customer:customer,
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            total: product.price * quantity
        };



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


        return res.status(503).json({
            message: "Products service is unavailable"
        });
        
    }
    
})

module.exports = app