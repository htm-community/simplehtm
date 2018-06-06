let d3 = require('d3')

class CyclicEncoder {

    constructor(opts) {
        this.resolution = opts.resolution || 1
        this.n = opts.n
        this.w = opts.w
        this.scale = d3.scaleLinear()
            .domain(this.inputDomain)
            .range(this.outputRange)
    }

    get inputDomain() {
        return [0, this.n * this.resolution]
    }

    get outputRange() {
        return [0, this.n]
    }

    encode(value) {
        let out = []
        let inputDomain = this.inputDomain
        if (value < inputDomain[0] || value > inputDomain[1]) {
            throw new Error('Cannot encode value outside valid range: ' + value)
        }
        d3.range(0, this.n).forEach(() => { out.push(0) })
        let index = Math.floor(this.scale(value))
        out[index] = 1
        for (let i = 1; i < this.w; i++) {
            let bitIndex = index + i
            // Adjust for out of range, by cycling around
            if (bitIndex >= this.n) bitIndex = bitIndex - this.n
            if (bitIndex > this.n - 1) {
                throw new Error('CyclicEncoder attempted to store bits out of range!')
            }
            out[bitIndex] = 1
        }
        return out
    }
}

module.exports = CyclicEncoder
