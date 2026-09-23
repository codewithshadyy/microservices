


const express = require("express")
const app = express()
const products = require("./routes/products")
const {serviceauth} = require("./middleware/serviceAuth")
const PORT=3003


app.use(express.json())

app.use("/products", serviceauth, products)

app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        service: "products"
    });
});

app.get("/health/live", (req, res) => {
    return res.status(200).json({
        status: "alive",
        service: "products"
    });
});

app.get("/health/ready", (req, res) => {
    return res.status(200).json({
        status: "ready",
        service: "products"
    });
});

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})