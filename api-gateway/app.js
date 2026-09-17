

const express = require("express")
const app = express()
proxy = require("express-http-proxy")

PORT=3001

app.use(express.json())

app.use("", proxy('http://localhost:3002'))

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
})