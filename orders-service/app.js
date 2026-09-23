
const express = require("express")
const app = express()
const orders = require("./routes/orders")
const PORT=3002

app.use(express.json())

app.use("/orders", orders)



app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        service: "products"
    });
});


app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})