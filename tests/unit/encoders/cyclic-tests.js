const assert = require('chai').assert
const expect = require('chai').expect
const CyclicEncoder = require('../../../src/encoders/cyclic')
const DayOfWeekCategoryEncoder = require('../../../src/encoders/dayOfWeekCategory')

describe('cyclic encoders', () => {

    describe('when encoding same number of values as bits with range of 1', () => {
        let values = 20,
            buckets = 20,
            range = 1,
            encoder = new CyclicEncoder({
                values: values,
                buckets: buckets,
                range: range,
            })
        it('encodes one value per bit', () => {
            let start = 0, end = values - 1
            for (let i = start; i < end; i++) {
                let value = i
                let encoding = encoder.encode(value)
                encoding.forEach((bit, index) => {
                    if (index === i) {
                        expect(bit).to.equal(1)
                    } else {
                        expect(bit).to.equal(0)
                    }
                })
            }
        })
    })

    describe('when encoding days of week', () => {
        it('encodes a unique bit range per day with 1 bit range', () => {
            let encoder = new DayOfWeekCategoryEncoder({
                range: 1,
            })
            let Sunday = encoder.encode(encoder.daysOfWeek[0])
            let Monday = encoder.encode(encoder.daysOfWeek[1])
            let Tuesday = encoder.encode(encoder.daysOfWeek[2])
            let Wednesday = encoder.encode(encoder.daysOfWeek[3])
            let Thursday = encoder.encode(encoder.daysOfWeek[4])
            let Friday = encoder.encode(encoder.daysOfWeek[5])
            let Saturday = encoder.encode(encoder.daysOfWeek[6])

            expect(Sunday).to.deep
                .equal([1,0,0,0,0,0,0])
            expect(Monday).to.deep
                .equal([0,1,0,0,0,0,0])
            expect(Tuesday).to.deep
                .equal([0,0,1,0,0,0,0])
            expect(Wednesday).to.deep
                .equal([0,0,0,1,0,0,0])
            expect(Thursday).to.deep
                .equal([0,0,0,0,1,0,0])
            expect(Friday).to.deep
                .equal([0,0,0,0,0,1,0])
            expect(Saturday).to.deep
                .equal([0,0,0,0,0,0,1])
        })

        it('encodes a unique bit range per day with many bit range', () => {
            let encoder = new DayOfWeekCategoryEncoder({
                range: 3,
            })
            let Sunday = encoder.encode(encoder.daysOfWeek[0])
            let Monday = encoder.encode(encoder.daysOfWeek[1])
            let Tuesday = encoder.encode(encoder.daysOfWeek[2])
            let Wednesday = encoder.encode(encoder.daysOfWeek[3])
            let Thursday = encoder.encode(encoder.daysOfWeek[4])
            let Friday = encoder.encode(encoder.daysOfWeek[5])
            let Saturday = encoder.encode(encoder.daysOfWeek[6])

            expect(Sunday).to.deep
                .equal([1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1])
            expect(Monday).to.deep
                .equal([0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(Tuesday).to.deep
                .equal([0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(Wednesday).to.deep
                .equal([0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0])
            expect(Thursday).to.deep
                .equal([0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0])
            expect(Friday).to.deep
                .equal([0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0])
            expect(Saturday).to.deep
                .equal([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0])
        })

    })

    describe('when encoding weekends', () => {
        it('')
    })

})
