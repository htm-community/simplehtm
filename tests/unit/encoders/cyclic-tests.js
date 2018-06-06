const assert = require('chai').assert
const expect = require('chai').expect
const CyclicEncoder = require('../../../src/encoders/cyclic')
const DayOfWeekCategoryEncoder = require('../../../src/encoders/dayOfWeekCategory')

describe('cyclic encoders', () => {

    describe('resolution 1', () => {
        describe('n 2', () => {
            it('encodes 1 value per bit', () => {
                let encoder = new CyclicEncoder({
                    resolution: 1,
                    n: 2,
                    w: 1,
                })
                expect(encoder.encode(0)).to.deep.equal([1,0])
                expect(encoder.encode(1)).to.deep.equal([0,1])
            })
        })
        describe('n 4', () => {
            it('encodes 1 value per bit', () => {
                let encoder = new CyclicEncoder({
                    resolution: 1,
                    n: 5,
                    w: 1,
                })
                expect(encoder.encode(0)).to.deep.equal([1,0,0,0,0])
                expect(encoder.encode(1)).to.deep.equal([0,1,0,0,0])
                expect(encoder.encode(2)).to.deep.equal([0,0,1,0,0])
                expect(encoder.encode(3)).to.deep.equal([0,0,0,1,0])
                expect(encoder.encode(4)).to.deep.equal([0,0,0,0,1])
            })
        })
    })

    describe('resolution 5', () => {
        it('encodes 5 values per bit', () => {
            let encoder = new CyclicEncoder({
                resolution: 5,
                n: 2,
                w: 1,
            })
            expect(encoder.encode(0)).to.deep.equal([1,0])
            expect(encoder.encode(1)).to.deep.equal([1,0])
            expect(encoder.encode(2)).to.deep.equal([1,0])
            expect(encoder.encode(3)).to.deep.equal([1,0])
            expect(encoder.encode(4)).to.deep.equal([1,0])
            expect(encoder.encode(5)).to.deep.equal([0,1])
            expect(encoder.encode(6)).to.deep.equal([0,1])
            expect(encoder.encode(7)).to.deep.equal([0,1])
            expect(encoder.encode(8)).to.deep.equal([0,1])
            expect(encoder.encode(9)).to.deep.equal([0,1])
        })
    })

    // describe('when 7 values 7 buckets and range 1', () => {
    //     let values = 7,
    //         buckets = 7,
    //         range = 1,
    //         encoder = new CyclicEncoder({
    //             values: values,
    //             buckets: buckets,
    //             range: range,
    //         })
    //     it('has the correct resolution', () => {
    //         expect(encoder.resolution).to.equal(1)
    //     })
    // })
    //
    // describe('when 7 values 21 buckets and range 3', () => {
    //     let values = 7,
    //         buckets = 21,
    //         range = 3,
    //         encoder = new CyclicEncoder({
    //             values: values,
    //             buckets: buckets,
    //             range: range,
    //         })
    //     it('has the correct resolution', () => {
    //         expect(encoder.resolution).to.equal(1)
    //     })
    // })

    describe('when encoding days of week', () => {
        it('encodes a unique bit range per day with 1 bit range', () => {
            let encoder = new DayOfWeekCategoryEncoder({
                w: 1,
            })
            let Sunday = encoder.encode(encoder.daysOfWeek[0])
            let Monday = encoder.encode(encoder.daysOfWeek[1])
            let Tuesday = encoder.encode(encoder.daysOfWeek[2])
            let Wednesday = encoder.encode(encoder.daysOfWeek[3])
            let Thursday = encoder.encode(encoder.daysOfWeek[4])
            let Friday = encoder.encode(encoder.daysOfWeek[5])
            let Saturday = encoder.encode(encoder.daysOfWeek[6])

            expect(encoder.resolution).to.equal(1)

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
                w: 3,
            })
            let Sunday = encoder.encode(encoder.daysOfWeek[0])
            let Monday = encoder.encode(encoder.daysOfWeek[1])
            let Tuesday = encoder.encode(encoder.daysOfWeek[2])
            let Wednesday = encoder.encode(encoder.daysOfWeek[3])
            let Thursday = encoder.encode(encoder.daysOfWeek[4])
            let Friday = encoder.encode(encoder.daysOfWeek[5])
            let Saturday = encoder.encode(encoder.daysOfWeek[6])

            expect(encoder.resolution).to.equal(1)

            expect(Sunday).to.deep
                .equal([1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(Monday).to.deep
                .equal([0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(Tuesday).to.deep
                .equal([0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(Wednesday).to.deep
                .equal([0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0])
            expect(Thursday).to.deep
                .equal([0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0])
            expect(Friday).to.deep
                .equal([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0])
            expect(Saturday).to.deep
                .equal([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1])
        })

    })

})
