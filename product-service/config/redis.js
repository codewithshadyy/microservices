
const {createClient} = require("redis")

const redisClient = createClient({
    url:process.env.REDIS_URL,
    socket:{
        reconnectStrategy:(retries) => {

             if (retries > 10) {
        return new Error('Redis reconnection failed permanently')
      }
      return Math.min(retries * 100, 3000)

        }
    }
})

redisClient.on("error", (error) => {
 console.error("Redis Error.....", error)
})

async function connectRedis(params) {

    if(!redisClient.isOpen) {

        await redisClient.connect()
       
    }

     console.log("Connected to Redis successfully")
    
}


module.exports = {
    redisClient,
    connectRedis
}