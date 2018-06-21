const CategoryEncoder = require('./category')


class WeekendEncoder extends CategoryEncoder {

    constructor(opts) {
        super({
            w: opts.w,
            categories: ['weekday', 'weekend'],
        })
    }

    encode(date) {
        let dayOfWeek = date.getDay()
        let value = 'weekday'
        if (dayOfWeek === 0 || dayOfWeek === 6)
            value ='weekend'
        return super.encode(value)
    }

}

module.exports = WeekendEncoder
