
const { json } = require("express")
const {getChannel} = require("./rabbitmq")
const EXCHANGE = "orders.exchange"

async function publishOrderCreated(order) {

    const channel = getChannel()

    await channel.assertExchange(EXCHANGE, 'direct', {
        burable:true
    })

    const message = Buffer.from(JSON.stringify(order))

    channel.publish(
        EXCHANGE,
        "order.created",
        message,
        {
            persistent:true
        }
    )

    console.log("published order.created event")
    
}



module.exports = publishOrderCreated