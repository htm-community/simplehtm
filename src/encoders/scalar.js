let d3 = require('d3')

class ScalarEncoder {

    constructor(opts) {
        this.n = opts.n
        this.w = opts.w
        this.bounded = opts.bounded
        // Either set the resolution or the min/max
        if (opts.resolution !== undefined) {
            this.resolution = opts.resolution
        } else {
            // bypassing the setters
            this._min = opts.min
            this._max = opts.max
        }
        this.__createScales()
    }

    get inputDomain() {
        return [this.min, this.max]
    }

    get outputRange() {
        return [0, this.n]
    }

    /**
     * Returns the scalar range of values encoded within one output bit.
     */
    get resolution() {
        return (this._max - this._min) / this.n
    }

    get min() {
        return this._min
    }
    get max() {
        return this._max
    }

    set resolution(r) {
        this.min = 0
        this.max = this.n * r
    }

    set min(m) {
        this._min = m
        this.__createScales()
    }
    set max(m) {
        this._max = m
        this.__createScales()
    }

    // These linear scales are used to move from input domain to
    // output range and back. The are re-created anytime the min
    // or max values change, or n changes.
    __createScales() {
        this.scale = d3.scaleLinear()
            .domain(this.inputDomain)
            .range(this.outputRange)
        this.reverseScale = d3.scaleLinear()
            .domain(this.outputRange)
            .range(this.inputDomain)
    }

    // Using the scale, get the correspoding integer index for value
    scaleInputValueToOutputIndex(value) {
        let index = Math.floor(this.scale(value))
        if (index > this.n - 1) {
            index = this.n - 1
        }
        return index
    }

    __checkValue(value) {
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

    // This is meant to be overridden by subclasses that want to apply bitmasks
    // differently, for example a cyclic encoder.
    _applyBitmaskAtIndex(encoding, index) {
        let out = [],
            w = this.w,
            lowerValue = this.reverseScale(index - (w/2)),
            upperValue = this.reverseScale(index + (w/2))

        // For each bit in the encoding, we get the input domain value. Using w, we
        // know how wide the bitmask should be, so we use the reverse scales to define
        // the size of the bitmask. If this index is within the value range, we turn
        // it on.
        for (let i = 0; i < this.n; i++) {
            let bitValue = this.reverseScale(i),
                bitOut = 0
            if (lowerValue <= bitValue && bitValue < upperValue) {
                bitOut = 1
            }
            out.push(bitOut)
        }
        return out
    }

    encode(value) {
        this.__checkValue(value)
        let out = this.__getEmptyEncoding()
        let index = this.scaleInputValueToOutputIndex(value)
        out[index] = 1
        return this._applyBitmaskAtIndex(out, index)
    }
}

module.exports = ScalarEncoder
