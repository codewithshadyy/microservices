

const amplib = require("amqplib")

const RABBITMQ_URL = process.env.RABBITMQ_URL
const EXCHANGE = "orders.exchange"
const QUEUE = "orders.created.queue"
const ROUTING_KEY = "order.created"


async function start(params) {

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

    channel.consume(QUEUE, (message) => {
        if(!message){
            return
        }



        const order = JSON.parse(
            message.content.toString()
        )

        console.log("order event received")

        console.log(order)

        channel.ack(message)
    })
}

start().catch((error) => {
    console.log("Notification service failed:", error)
})