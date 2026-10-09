
const {createClient} = require("redis")

const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on("error", (error) => {
 console.error("Redis Error.....", error)
})

async function connectRedis(params) {

    if(redisClient.isOpen) {

        await redisClient.connect()
       
    }

     console.log("Connected to Redis successfully")
    
}


module.exports = {
    redisClient,
    connectRedis
}