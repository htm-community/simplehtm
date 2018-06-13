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

    // Setters

    set resolution(r) {
        this._min = 0
        this._max = this.n * r
    }

    set min(m) {
        this._min = m
        this.__createScales()
    }
    set max(m) {
        this._max = m
        this.__createScales()
    }

    // Getters

    // The minimum input value range, to the max value range.
    // This range is inclusive on both bounds and continuous.
    get inputDomain() {
        return [this.min, this.max]
    }

    // The integer range of bit indices for output from this encoder.
    get outputRange() {
        return [0, this.n]
    }

    // Range of values represented within one output bit.
    get resolution() {
        return (this._max - this._min) / this.n
    }

    // Minimum scalar value that can be represented.
    get min() {
        return this._min
    }
    // Maximum scalar value that can be represented.
    get max() {
        return this._max
    }

    // Accepts a scalar value within the input domain, returns an
    // array of bits representing the value.
    encode(value) {
        // Create an array of n zeros JavaScript style :P
        let out = Array.apply(null, Array(this.n))
            .map(Number.prototype.valueOf,0);
        // Using the scale, get the corresponding integer
        // index for this value
        let index = Math.floor(this.scale(value))
        if (index > this.n - 1) {
            index = this.n - 1
        }
        // Turn on the targeted index
        out[index] = 1
        // Apply a mask at the targeted bit index in another
        // function, so we can subclass it!
        return this._applyBitmaskAtIndex(out, index)
    }

    // This is meant to be overridden by subclasses that want
    // to apply bitmasks differently.
    _applyBitmaskAtIndex(encoding, index) {
        let out = [],
            w = this.w,
            lowerValue = this.reverseScale(index - (w/2)),
            upperValue = this.reverseScale(index + (w/2))

        // For each bit in the encoding, we get the input domain
        // value. Using w, we know how wide the bitmask should
        // be, so we use the reverse scales to define the size
        // of the bitmask. If this index is within the value
        // range, we turn it on.
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

}

module.exports = ScalarEncoder
