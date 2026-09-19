

const express = require("express")
const app = express.Router()



const products = [
    {  
        "id":1,
        "name":"monitor",
        "price":13000,
        "brand":"hp"
    },
    {    "id":2,
        "name":"table",
        "price":4000,
        "brand":"gutters"
        
    }
]
app.get("/", async (req,res) => {

    return res.status(200).json(products)
    
})



app.get("/:id", async (req,res) => {

    const product = products.find(
        product => product.id === parseInt(req.params.id)
    )

    if(!product){
        return res.status(404).json({
            message:"Product not found"
        })
    }

    return res.status(200).json(product)
    
})




module.exports  =app