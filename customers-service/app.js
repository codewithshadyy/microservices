
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


app.listen(PORT, () => {
    console.log(`Customers service running on :  http://localhost:${PORT}`)
})