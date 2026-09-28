const { getChannel } = require("./rabbitmq")

const EXCHANGE = "orders.exchange"
const QUEUE = "order.created.queue"
const ROUTING_KEY = "order.created"

async function setupOrderQueue() {
    const channel = getChannel()

    await channel.assertExchange(EXCHANGE, "direct", {
        durable: true
    })

    await channel.assertQueue(QUEUE, {
        durable: true
    })

    await channel.bindQueue(
        QUEUE,
        EXCHANGE,
        ROUTING_KEY
    )

    console.log("Order queue ready")

    return QUEUE
}

module.exports = setupOrderQueue;