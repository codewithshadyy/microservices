

class CircuitBreaker{

    constructor(action, failureThreshold=3){
        this.action = action
        this.failureThreshold = failureThreshold
        this.failures = 0
        this.state = "CLOSED"
    }

    async execute()  {

        if (this.state === "OPEN"){
            throw new error("The circuit is open")
        }

        try {
            const result = await this.action(...arguments)
            this.failures = 0
            return result
            
        } catch (error) {

            this.failures++
            console.log(`Failure count: ${this.failures}`)
            if (this.failures >= this.failureThreshold) {
                this.state = "OPEN";

                console.log("Circuit breaker OPEN");
            }

            throw error;
        
            
        }
        
    }
}


module.exports = CircuitBreaker