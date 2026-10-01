

const amplib = require("amqplib")


const DLX = "orders.dlx"
const DLQ = "orders.failed.queue"
const RABBITMQ_URL = process.env.RABBITMQ_URL
const EXCHANGE = "orders.exchange"
const QUEUE = "orders.created.queue"
const ROUTING_KEY = "order.created"


async function start() {

    const connection  = await amplib.connect(RABBITMQ_URL)

    const channel = await connection.createChannel()

    console.log("connected to RabbitMq")

    channel.assertExchange(EXCHANGE, "direct", {
        durable:true
    })
    
    channel.assertExchange(DLX, "direct", {
        durable:true    
    })

    channel.assertQueue(DLQ, {
        durable:true
    })

    await channel.assertQueue(
        DLQ,
        DLX,
        "order.failed"
    )

    await channel.assertQueue(QUEUE, {
        durable:true,
        deadLetterExchange:DLX,
        deadLetterRoutingKey:"order.failed"
    })

    await channel.bindQueue(
        QUEUE,
        EXCHANGE,
        ROUTING_KEY
    )

    console.log("notifications service waiting for orders.....")
    channel.prefetch(1) 
    channel.consume(QUEUE, async(message) => {
        if(!message){
            return
        }

try {

    const order = JSON.parse(
        message.content.toString()
    )

    console.log(`[${process.env.INSTANCE}] Processing order`, order)

    console.log(`[${process.env.INSTANCE}] Sending notifications  for: ${order.orderId}`)

    await new Promise(resolve => setTimeout(resolve,5000))

   throw new Error("Testing Retry");
   

    // channel.ack(message)
    
} catch (error) {

    const retryCount = message.properties.headers?.["x-retry-count"] || 0

    console.log(`Processing failed.Attempt:${retryCount + 1}`)


    if(retryCount < 2){
        const nextRetryCount = retryCount + 1

        channel.sendToQueue(
            QUEUE,
            message.content,
            {

                persistent:true,
                headers:{
                    "x-retry-count":nextRetryCount
                }

            }
        )
        channel.ack(message)

          console.log(
                `Retrying message (${nextRetryCount}/3)`
            )


    } else{


         channel.nack(
        message,
        false,
        false
    )

    console.log(
                " Maximum retries reached. Sending to DLQ."
            )






    }
   

   



    
}
      
    }, {noAck:false})
}

start().catch((error) => {
    console.log("Notification service failed:", error)
})