
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

        const  {productId, quantity} = req.body

        const response = await axios.get(
            `http://localhost:3003/products/${productId}`
        )

        const product = response.data

        const order = {
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

         if (error.response?.status === 404) {
            return res.status(404).json({
                message: "Product does not exist"
            });
        }

        return res.status(503).json({
            message: "Products service is unavailable"
        });ccd 
        
    }
    
})

module.exports = app