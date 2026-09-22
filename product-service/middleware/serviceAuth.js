
require("dotenv").config()


exports.serviceauth = (req,res, next) => {
    const serviceKey   = req.headers["x-service-key"]
    
    if(!serviceKey){
        return res.status(401).json({
   message:"Service authentication Required"
        })
    }

    if(serviceKey !== process.env.SERVICE_SECRET){
        return res.status(403).json({
            message:"Invalide service credentials"
        })
    }
    next()
}