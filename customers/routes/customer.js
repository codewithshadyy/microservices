const express = require("express")
const router = express.Router()



const customers = [
    {
        "id":1,
        "name":"flame",
        "email":"flame@gmail.com"
    },

        {
        "id":2,
        "name":"layla",
        "email":"layla@gmail.com"
    }
]



router.get("/", async (req,res) => {

    return res.status(200).json({
        message:"Customer service",
        data:customers
    })
    
})

router.get("/:id", async (req,res) => {

    const customer = customers.find(customer => customer.id === parseInt(req.params.id))
    if(!customer){
        return res.status(404).json({
            message:"customer Not Found"
        })
    }

    return res.status(200).json(customer)
    
})


module.exports = router