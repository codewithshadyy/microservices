

const express = require("express")
const app = express.Router()

app.get("/", async (req,res) => {

    return res.status(200).json({
        "message":"product service"
    })
    
})





module.exports  =app