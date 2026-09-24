

const express = require("express")
const app = express.Router()

const pool = require("../db")



// const products = [
//     {  
//         "id":1,
//         "name":"monitor",
//         "price":13000,
//         "brand":"hp"
//     },
//     {    "id":2,
//         "name":"table",
//         "price":4000,
//         "brand":"gutters"
        
//     }
// ]




app.get("/", async (req,res) => {



try {
    const result = await pool.query(
        "SELECT * FROM product ORDER BY id"
    )

    return res.status(200).json(result.rows)
    
} catch (error) {

    console.error("Error connecting to the database:", error)

    return res.status(500).json({
        message:"Failed to fetsch productss"
    })
    
}
})



app.get("/:id", async (req,res) => {

      console.log("Products endpoint called")

  
try {

    const result = await pool.query(
        "SELECT * FROM  product WHERE id = $1",
        [req.params.id]
    )

    if(result.rows === 0){

        return res.status(404).json({
                message: "Product not found"
            })
    }

      return res.status(200).json(result.rows[0])
    
} catch (error) {

      console.error("Database error:", error);

        return res.status(500).json({
            message: "Failed to fetch product"
        })
    
}


})




module.exports  =app