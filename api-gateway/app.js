

const express = require("express")
const app = express()
const proxy = require("express-http-proxy")

const PORT=3001

app.use(express.json())
require("dotenv").config()


app.get("/", (req, res) => {
    res.json({
        message: "API Gateway is working"
    });
});

app.use(
    "/orders",
    proxy(process.env.ORDER_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl
    })
);

app.use("/products", proxy('http://localhost:3003',
    {
        proxyReqPathResolver:(req) => req.originalUrl
    }
))

app.use("/customers", proxy('http://localhost:3004',
    {
        proxyReqPathResolver:(req) => req.originalUrl
    }
))

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})