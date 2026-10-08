
const { json } = require("express")
const {getChannel} = require("./rabbitmq")
const EXCHANGE = "orders.exchange"

async function publishOrderCreated(order) {

    const channel = getChannel()

    await channel.assertExchange(EXCHANGE, 'direct', {
        durable:true
    })

    const message = Buffer.from(JSON.stringify(order))

    channel.publish(
        EXCHANGE,
        "order.created",
        message,
        {
            persistent:true
        },
        (err, ok) => {

        if (err) {
                 console.log("Publish failed");
          } else {
                console.log("RabbitMQ confirmed message");
       }
       
        }
    )

    console.log("published order.created event")
    
}



module.exports = publishOrderCreated