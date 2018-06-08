const CyclicEncoder = require('./cyclicScalar')

const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

class DayOfWeekCategoryEncoder extends CyclicEncoder {

    constructor(opts) {
        // Seven days in a week, then increase bit count based upon range.
        opts.w = opts.w
        opts.n = opts.w * 7
        opts.min = 0
        opts.max = 7
        super(opts)
    }

    encode(value) {
        let scalarValue = DAYS_OF_WEEK.indexOf(value)
        return super.encode(scalarValue)
    }

    get daysOfWeek() {
        return DAYS_OF_WEEK
    }

}

module.exports = DayOfWeekCategoryEncoder
