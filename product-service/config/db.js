

const  {Pool} = require("pg")
require("dotenv").config()


const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max:10,
    idleTimeoutMillis:30_000,
    connectionTimeoutMillis:5_000
})


pool.on("connect", () => {
    console.log("Postgresql connected successfulllyy")
})

pool.on("error", (error) => {
    console.error(`Error connecting to postgresql:${error.message}`)
})



module.exports  = pool
