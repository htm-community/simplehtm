let d3 = require('d3')

class CyclicEncoder {

    constructor(opts) {
        this.values = opts.values
        this.buckets = opts.buckets
        this.range = opts.range
        this.scale = d3.scaleLinear()
            .domain([0, this.values])
            .range([0, this.buckets])
    }

    encode(value) {
        let out = []
        let buckets = this.buckets
        if (value >= buckets) {
            throw new Error('Cannot encode value outside bucket range: ' + value)
        }
        d3.range(0, this.buckets).forEach(() => { out.push(0) })
        let index = Math.round(this.scale(value))
        out[index] = 1
        let flip = false
        let step = 0
        for (let i = 1; i < this.range; i++) {
            let move = step + 1
            if (flip) {
                move = -move
                step++
            }
            let bitIndex = index + move
            // Adjust for out of range, by cycling around
            if (bitIndex >= buckets) bitIndex = bitIndex - buckets
            if (bitIndex < 0) bitIndex = bitIndex + buckets
            if (bitIndex > buckets-1) {
                throw new Error('CyclicEncoder attempted to store bits out of range!')
            }
            out[bitIndex] = 1
            flip = ! flip
        }
        let validated = 0
        function isValid(bit) {
            validated++
            return bit === 0 || bit === 1
        }

        // Old checks I left in just in case and also because I didn't write unit tests.
        if (! out.every(isValid) || validated !== out.length) {
            throw new Error('CyclicEncoder created non-continuous output!')
        }
        if (out.length > this.buckets) {
            throw new Error('CyclicEncoder created output of the wrong length!')
        }

        return out
    }
}

module.exports = CyclicEncoder
