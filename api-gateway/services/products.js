
const products = [
    "http://localhost:3003",
    "http://localhost:3005"
]

let currentIndex = 0

function getNextProduct() {
    
    service = products[currentIndex]

    currentIndex = (currentIndex + 1 ) % products.length



    console.log("Routing to:", service)

    return service


}


module.exports = getNextProduct