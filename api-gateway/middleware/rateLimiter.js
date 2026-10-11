
const {RedisStore} = require("rate-limit-redis")

const {redisClient} = require("../config/redis")
const {rateLimit} = require("express-rate-limit")

exports.rateLimiter = rateLimit({
    windowMs:60 * 100,
    limit:60,

    standardHeaders:"draft-8",
    legacyHeaders:false,

    store:await RedisStore({
     sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: "rate-limit:"
    }),

    message:{
        error:"Too mny requests. try again later"
    }
})