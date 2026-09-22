


const express = require("express")
const app = express()
const products = require("./routes/products")
const {serviceauth} = require("./middleware/serviceAuth")
const PORT=3003


app.use(express.json())

app.use("/products", serviceauth, products)

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})