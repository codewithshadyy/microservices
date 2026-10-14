

const express =require("express")
const app = express()
const mongoose = require("mongoose")
const router = require("./routes/owners")

require("dotenv").config()

app.use(express.json())



mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("User service db connected successfully"))
.catch(error => console.log(`Error while connecting to the user service db:${error.message}`))

app.use()


app.listen(process.env.PORT, () => {
    console.log(`user service is on:http://localhost:${process.env.PORT}`)
})






