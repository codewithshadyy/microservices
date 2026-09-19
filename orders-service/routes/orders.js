
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

module.exports = app