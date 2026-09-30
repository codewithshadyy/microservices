

const amplib = require("amqplib")

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
    
    channel.assertQueue(QUEUE, {
        durable:true
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

    channel.ack(message)
    
} catch (error) {
    console.error("Error failed to process the message:", error.message)

    channel.nack(
        message,
        false,
        true
    )



    
}
      
    }, {noAck:false})
}

start().catch((error) => {
    console.log("Notification service failed:", error)
})