
const axios = require("axios")

const products = [
    "http://localhost:3003",
    "http://localhost:3005"
]

let currentIndex = 0

async function getNextProduct() {
    

    for (let i = 0; products.length; i++){

        const service = products[currentIndex]

        currentIndex = (currentIndex + 1) % products.length



        try {



            await axios.get(`${service}/health/live`, {

                timeout:1000
            })

            console.log("Healthy product service:", service)

            return service
            
        } catch (error) {

            console.log("Unhealthy product service:", service)

            
        }

    }

    throw new Error("No product service is available")


}


module.exports = getNextProduct