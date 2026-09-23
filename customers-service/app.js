
const express = require("express")
const app = express()
const PORT = 3004

const customers = require("./routes/customer")

app.use(express.json())

app.use("/customers", customers)

app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        service: "customers"
    });
});


app.get("/health/live", (req, res) => {
    return res.status(200).json({
        status: "alive",
        service: "customers"
    });
});

app.get("/health/ready", (req, res) => {
    return res.status(200).json({
        status: "ready",
        service: "customers"
    });
});


app.listen(PORT, () => {
    console.log(`Customers service running on :  http://localhost:${PORT}`)
})