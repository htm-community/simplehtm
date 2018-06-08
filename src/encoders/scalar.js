let d3 = require('d3')

class ScalarEncoder {

    constructor(opts) {
        this.n = opts.n
        this.w = opts.w
        if (opts.resolution !== undefined) {
            // This will automatically set the min/max
            this.resolution = opts.resolution
        } else {
            this.min = opts.min
            this.max = opts.max
            this.__createScales()
        }
        this.bounded = opts.bounded || false
    }

    get inputDomain() {
        let min = 0,
            max = 0
        if (this.min !== undefined && this.max !== undefined) {
            min = this.min
            max = this.max
        } else {
            max = this.n * this.resolution
        }
        return [min, max]
    }

    get outputRange() {
        return [0, this.n]
    }

    set resolution(r) {
        //             this.resolution = (this.max - this.min) * this.w / this.n
        this._resolution = r
        this.min = 0
        this.max = this.n * this.resolution
        // Since min/max changed, we have to re-create the scales.
        this.__createScales()
    }

    get resolution() {
        if (this._resolution !== undefined) return this._resolution
        else return (this.max - this.min) * this.w / this.n
    }

    __createScales() {
        this.scale = d3.scaleLinear()
            .domain(this.inputDomain)
            .range(this.outputRange)
        this.reverseScale = d3.scaleLinear()
            .domain(this.outputRange)
            .range(this.inputDomain)
    }

    __getClosestOutIndex(value) {
        let index = Math.floor(this.scale(value))
        if (index > this.n - 1) {
            // floor index to max
            index = this.n - 1
        }
        return index
    }

    __checkValue(value) {
        // check
        let inputDomain = this.inputDomain
        if (value < inputDomain[0] || value > inputDomain[1]) {
            throw new Error('Cannot encode value outside valid range: ' + value)
        }
    }

    __getEmptyEncoding() {
        let out = []
        d3.range(0, this.n).forEach(() => { out.push(0) })
        return out
    }

    _applyOutputBitRangeAtIndex(encoding, index, value) {
        let out = []
        // For each bit in the encoding.
        for (let i = 0; i < this.n; i++) {
            let bitScalarValue = this.reverseScale(i),
                bitOut = 0,
                min = this.min,
                max = this.max,
                resolution = this.resolution,
                valueDiff = bitScalarValue - value,
                valueDistance = Math.abs(valueDiff),
                radius = this.resolution / 2
            if (valueDistance <= radius) bitOut = 1
            if (this.bounded) {
                // Keeps the bucket from changing size at min/max values
                if (value < (min + radius) && bitScalarValue < (min + resolution)) bitOut = 1
                if (value > (max - radius) && bitScalarValue > (max - resolution)) bitOut = 1
            }
            out.push(bitOut)
        }
        return out
    }

    encode(value) {
        this.__checkValue(value)
        let index = this.__getClosestOutIndex(value)
        let out = this.__getEmptyEncoding()
        out[index] = 1
        return this._applyOutputBitRangeAtIndex(out, index, value)
    }
}

module.exports = ScalarEncoder
