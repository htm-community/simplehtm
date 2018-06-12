let ScalarEncoder = require('./scalar')

class BoundedScalarEncoder extends ScalarEncoder {

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

            // Keeps the output width from changing size at min/max values
            if (lowerValue < min && bitValue < lowerBuffer) {
                bitOut = 1
            }
            if (upperValue > max && bitValue >= upperBuffer) {
                bitOut = 1
            }
            out.push(bitOut)
        }
        return out
    }

}

module.exports = BoundedScalarEncoder
