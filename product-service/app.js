


const express = require("express")
const app = express()
const products = require("./routes/products")
PORT=3003

app.use(express.json())

app.use("/products", products)

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})