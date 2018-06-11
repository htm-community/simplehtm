let d3 = require('d3')

class ScalarEncoder {

    constructor(opts) {
        this.n = opts.n
        this.w = opts.w
        if (opts.resolution !== undefined) {
            // This will automatically set the _min/_max
            this.resolution = opts.resolution
        } else {
            this._min = opts.min
            this._max = opts.max
            this.__createScales()
        }
        this.bounded = opts.bounded || false
    }

    get inputDomain() {
        let min = 0,
            max = 0
        if (this._min !== undefined && this._max !== undefined) {
            min = this._min
            max = this._max
        } else {
            max = this.n * this.resolution
        }
        return [min, max]
    }

    get outputRange() {
        return [0, this.n]
    }

    /**
     * Returns the scalar range of values encoded within one output bit.
     */
    get resolution() {
        if (this._resolution !== undefined) return this._resolution
        else return (this._max - this._min) / this.n
    }

    get min() {
        return this._min
    }
    get max() {
        return this._max
    }

    // after min, _max, or resolution are set, gotta re-create the scales

    set resolution(r) {
        this._resolution = r
        this._min = 0
        this._max = this.n * this.resolution
        // Since _min/_max changed, we have to re-create the scales.
        this.__createScales()
    }

    set min(m) {
        this._min = m
        this.__createScales()
    }
    set max(m) {
        this._max = m
        this.__createScales()
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
            // floor index to _max
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

    _applyBitmaskAtIndex(encoding, index) {
        let out = [],
            w = this.w,
            n = this.n,
            min = this.min,
            max = this.max,
            lowerBuffer = this.reverseScale(w),
            upperBuffer = this.reverseScale(n - w),
            lowerValue = this.reverseScale(index - (w/2)),
            upperValue = this.reverseScale(index + (w/2))


        // For each bit in the encoding.
        for (let i = 0; i < this.n; i++) {
            let bitValue = this.reverseScale(i),
                bitOut = 0

            if (lowerValue <= bitValue && bitValue < upperValue) {
                bitOut = 1
            }

            if (this.bounded) {
                // Keeps the bucket from changing size at _min/_max values
                if (lowerValue < min && bitValue < lowerBuffer) {
                    bitOut = 1
                }
                if (upperValue > max && bitValue >= upperBuffer) {
                    bitOut = 1
                }
                // let radius = w/2
                // if (index < (0 + radius) && i < (0 + radius)) bitOut = 1
                // if (index > (n - radius) && i > (n - radius)) bitOut = 1
                // if (value < (min + radius) && bitValue < (min + resolution)) bitOut = 1
                // if (value > (max - radius) && bitValue > (max - resolution)) bitOut = 1
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
        return this._applyBitmaskAtIndex(out, index)
    }
}

module.exports = ScalarEncoder
