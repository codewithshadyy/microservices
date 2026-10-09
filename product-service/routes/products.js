

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


app.post("/", async (req, res) => {

    try {

        const {name, price} = req.body

        if(!name || !price){
            return res.status(400).json({
                message:"Name and price are required"
            })
        }

        const queryText = `INSERT INTO product(name, price) VALUES(\$1, \$2)  RETURNING *`
        const inputFields = [name, price]

        const result = await pool.query(queryText, inputFields)

        return res.status(200).json({
            message:"product created successfully",
            data:result.rows
        })


        
    } catch (error) {
        return res.status(500).json({
            message:"error creating poroduct"
        })
        
    }

    
}
)



app.get("/:id", async (req,res) => {

      console.log("Products endpoint called")

      const productId = req.params.id
      const cacheKey = `product:${productId}`

  
try {

    const cacheProduct = await redisClient.get(cacheKey)

    if(cacheProduct){
        console.log("Cache hit", cacheKey)

       return res.status(200).json({
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


app.put("/:id", async (req,res) => {



      const productId = req.params.id

        const {name, price } = req.body

        const cacheKey = `product:${productId}`

        if (name === undefined || price === undefined) {
        return res.status(400).json({
            message: "Name and price are required"
        });
    }




    try {

        const queryText = `UPDATE product SET name = $1, price=$2 WHERE id = $3 RETURNING*`
        const inputFields = [name, price, productId]

        const result  = await pool.query(queryText, inputFields)


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const updatedProduct = result.rows[0]
        await redisClient.del(cacheKey)

         console.log("CACHE INVALIDATED:", cacheKey)

           return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        })


      
        
    } catch (error) {

        return res.status(500).json({
            message:"error updating the product",
            error
        })
        
    }
    
})




module.exports  =app