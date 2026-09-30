const { getChannel } = require("./rabbitmq")

const EXCHANGE = "orders.exchange"
const QUEUE = "orders.created.queue"
const ROUTING_KEY = "order.created"

const DLQ = "orders.failed.queue"
const DLX = "orders.dlx"
const DLQ_ROUTING_KEY = "order.failed"

async function setupOrderQueue() {
    const channel = getChannel()

    await channel.assertExchange(EXCHANGE, "direct", {
        durable: true
    })

    await channel.assertExchange(DLX,"direct", {
        durable: true
    })
       await channel.assertQueue(DLQ, {
        durable: true
    })


     await channel.bindQueue(
        DLQ,
        DLX,
        DLQ_ROUTING_KEY
    )

     await channel.assertQueue(QUEUE, {
        durable: true,
        deadLetterExchange: DLX,
        deadLetterRoutingKey: DLQ_ROUTING_KEY
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