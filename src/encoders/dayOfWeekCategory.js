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
        opts.w = opts.w || 3
        opts.n = opts.w * 7
        opts.resolution = 1
        super(opts)
    }

    encode(value) {
        let scalarValue = DAYS_OF_WEEK.indexOf(value)
        return super.encode(scalarValue * this.w)
    }

    get daysOfWeek() {
        return DAYS_OF_WEEK
    }

}

module.exports = DayOfWeekCategoryEncoder
