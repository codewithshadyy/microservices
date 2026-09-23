
const express = require("express")
const app = express()
const orders = require("./routes/orders")
const PORT=3002
const axios = require("axios")

app.use(express.json())

app.use("/orders", orders)



app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        service: "products"
    });
});


app.get("/health/live", (req, res) => {
    return res.status(200).json({
        status: "alive",
        service: "orders"
    });
});

// app.get("/health/ready", (req, res) => {
//     return res.status(200).json({
//         status: "ready",
//         service: "orders"
//     });
// });


app.get("/health/ready", async(req, res) => {
    

    try {

        await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/health/live`,
            {
                timeout: 2000
            }
        )

        await axios.get(
            `${process.env.CUSTOMER_SERVICE_URL}/health/live`,
            {
                timeout: 2000
            }
        )

        return res.status(200).json({
            status: "ready",
            service: "orders"
        });






        
    } catch (error) {

        return res.status(503).json({
            status:"Not Ready",
            service:"orders service"
        })
        
    }
});


app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})