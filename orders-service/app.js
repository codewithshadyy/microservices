
const express = require("express")
const app = express()
const orders = require("./routes/orders")
PORT=3002

app.use(express.json())

app.use("/", orders)

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})