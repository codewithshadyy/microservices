
const express = require("express")
const app = express.Router()


app.get("", async (req,res) => {

   return  res.status(200).json({
        message:"Fetching orders"
    })
    
})

module.exports = app