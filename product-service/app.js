


const express = require("express")
const app = express()
const products = require("./routes/products")
const {serviceauth} = require("./middleware/serviceAuth")
const {connectRedis} = require("./config/redis")
const PORT=process.env.PORT || 3003
const pool = require("./config/db")


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




async function startServer() {
    try {
        // PostgreSQL is essential to this service.
        await pool.query("SELECT 1");
        console.log("PostgreSQL connected successfully");
    } catch (error) {
        console.error("PostgreSQL connection failed:", error.message);
        process.exit(1);
        return;
    }

    // Redis improves performance, but is not required to serve requests.
    try {
        await connectRedis();
        console.log("Redis connected successfully");
    } catch (error) {
        console.error(
            "Redis unavailable. Starting without cache:",
            error.message
        );
    }

    app.listen(PORT, () => {
        console.log(`Products Service running on port ${PORT}`);
    });
}

startServer();

startServer()

