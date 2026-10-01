

const amplib = require("amqplib")
require("dotenv").config()

const DLX = "orders.dlx"
const DLQ = "orders.failed.queue"
const RABBITMQ_URL = process.env.RABBITMQ_URL
const EXCHANGE = "orders.exchange"
const QUEUE = "orders.created.queue"
const ROUTING_KEY = "order.created"

const RETRY_EXCHANGE = "orders.retry.exchange";
const RETRY_QUEUE_1 = "orders.retry.1.queue";
const RETRY_QUEUE_2 = "orders.retry.2.queue";
const RETRY_QUEUE_3 = "orders.retry.3.queue";
const RETRY_ROUTING_KEY = "order.retry";


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

    await channel.assertExchange(RETRY_EXCHANGE, "direct", {
    durable: true
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
        deadLetterRoutingKey:"order.failed",
       
    })

    await channel.bindQueue(
        QUEUE,
        EXCHANGE,
        ROUTING_KEY
    )

await channel.assertQueue(RETRY_QUEUE_1, {
    durable: true,
    deadLetterExchange: EXCHANGE,
    deadLetterRoutingKey: ROUTING_KEY,
    messageTtl: 1000
});


await channel.assertQueue(RETRY_QUEUE_2, {
    durable: true,
    messageTtl: 2000,
    deadLetterExchange: EXCHANGE,
    deadLetterRoutingKey: ROUTING_KEY
});

await channel.assertQueue(RETRY_QUEUE_3, {
    durable: true,
    messageTtl: 4000,
    deadLetterExchange: EXCHANGE,
    deadLetterRoutingKey: ROUTING_KEY
});

await channel.bindQueue(
    RETRY_QUEUE_1,
    RETRY_EXCHANGE,
    "retry.1"
)



await channel.bindQueue(
    RETRY_QUEUE_2,
    RETRY_EXCHANGE,
    "retry.2"
);

await channel.bindQueue(
    RETRY_QUEUE_3,
    RETRY_EXCHANGE,
    "retry.3"
);






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

         const retryRoutingKey = `retry.${nextRetryCount}`

        channel.publish(
            RETRY_EXCHANGE,
            retryRoutingKey,
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