

const express = require("express")
const app = express()
const proxy = require("express-http-proxy")
const {auth} = require("./middlewares/auth")
const {rateLimiter} = require("./middleware/rateLimiter")

const getNextProductService  = require("./services/products")

const {connectRedis, redisClient} = require("./config/redis")

const PORT=3001
require("dotenv").config()

app.use(express.json())
app.use(rateLimiter)





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





app.use("/products", auth, async (req, res, next) => {

    try {

        const service = await getNextProductService();

        console.log("Forwarding request to:", service);

        proxy(service, {
            proxyReqPathResolver: (req) => req.originalUrl,

            proxyReqOptDecorator: (proxyReqOpts) => {
                proxyReqOpts.headers["X-Service-Key"] =
                    process.env.PRODUCTS_SERVICE_KEY;

                return proxyReqOpts;
            }
        })(req, res, next);

    } catch (error) {

        return res.status(503).json({
            message: "No product service is available"
        });
    }
})




app.use("/customers", auth, proxy('http://localhost:3004',
    {
        proxyReqPathResolver:(req) => req.originalUrl
    }
))




async function startServer(params) {
    await connectRedis()
    app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})
    
}

startServer()

