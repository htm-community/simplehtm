const CyclicEncoder = require('./cyclic')

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
        opts.buckets = 7
        opts.bits = opts.buckets * opts.range
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
