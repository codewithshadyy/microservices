
const {createClient} = require("redis")
const { connect } = require("../../customers-service/routes/customer")

const redisClient = createClient({
    url:"redis://127.0.0.1:6379"
})

async function connectRedis() {

    if(!redisClient.isOpen){
        await redisClient.connect()
        console.log("Redis connected suceesfully")
    }
    
}


module.exports = {
    redisClient, connectRedis
}