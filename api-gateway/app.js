

const express = require("express")
const app = express()
const proxy = require("express-http-proxy")
const {auth} = require("./middlewares/auth")

const PORT=3001

app.use(express.json())
require("dotenv").config()




app.get("/", (req, res) => {
    res.json({
        message: "API Gateway is working"
    });
});

app.use(
    "/orders", auth,
    proxy(process.env.ORDER_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl
    })
);

app.use("/products",auth, proxy('http://localhost:3003',
    {
        proxyReqPathResolver:(req) => req.originalUrl,

           proxyReqOptDecorator: (proxyReqOpts) => {
            proxyReqOpts.headers["X-Service-Key"] =
                process.env.PRODUCTS_SERVICE_KEY;

            return proxyReqOpts;
        }
        
    },

    




    ))

app.use("/customers", auth, proxy('http://localhost:3004',
    {
        proxyReqPathResolver:(req) => req.originalUrl
    }
))

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})