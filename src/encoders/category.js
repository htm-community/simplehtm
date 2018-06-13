const CyclicEncoder = require('./cyclicScalar')


class CategoryEncoder extends CyclicEncoder {

    constructor(opts) {
        super({
            w: opts.w,
            n: opts.categories.length * opts.w,
            min: 0,
            max: opts.categories.length,
        })
        this.categories = opts.categories
    }

    encode(value) {
        let index = this.categories.indexOf(value)
        return super.encode(index)
    }

}

module.exports = CategoryEncoder
