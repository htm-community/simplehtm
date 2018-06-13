let ScalarEncoder = require('./scalar')

class CyclicScalarEncoder extends ScalarEncoder {

_applyBitmaskAtIndex(encoding, index) {
    for (let i = 1; i < this.w; i++) {
        let bitIndex = index + i
        // Adjust for out of range, by cycling around
        if (bitIndex >= this.n) bitIndex = bitIndex - this.n
        if (bitIndex > this.n - 1) {
            throw new Error('CyclicScalarEncoder attempted to store bits out of range!')
        }
        if (bitIndex > this.n - 1) throw new Error('Attempted encoding outside range')
        encoding[bitIndex] = 1
    }
    return encoding
}

}

module.exports = CyclicScalarEncoder
