



const eventBus = require("./eventBus");

eventBus.on("order.created", (order) => {

    console.log(" Order created event received");

    console.log({
        orderId: order.orderId,
        customerId: order.customerId,
        productId: order.productId,
        total: order.total
    });

});