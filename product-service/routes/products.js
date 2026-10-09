

const express = require("express")
const app = express.Router()

const pool = require("../config/db")
const {redisClient} = require("../config/redis")







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

      const productId = req.params.id
      const cacheKey = `product:${productId}`

  
try {

    const cacheProduct = await redisClient.get(cacheKey)

    if(cacheProduct){
        console.log("Cache hit", cacheKey)
        res.status(200).json({
            source:'redis',
            product:JSON.parse(cacheProduct)
        })
    }
    console.log("CACHE MISS:", cacheKey)

    const result = await pool.query(
        "SELECT * FROM  product WHERE id = $1",
        [productId]
    )

    if(result.rows.length === 0){

        return res.status(404).json({
                message: "Product not found"
            })
    }
    const product   =  result.rows[0]

    await redisClient.set(
        cacheKey,
        JSON.stringify(product),
        {
            EX:60
        }
      
    )

    console.log("Database hit", productId)
      return res.status(200).json({
        source:"postgresql",
        data:product
      })
    
} catch (error) {

      console.error("Database error:", error);

        return res.status(500).json({
            message: "Failed to fetch product"
        })
    
}


})




module.exports  =app