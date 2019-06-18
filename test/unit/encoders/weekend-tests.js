const assert = require('chai').assert
const expect = require('chai').expect
const WeekendEncoder = require('../../../src/encoders/weekend')

describe('weekend encoder', () => {

    describe('upon creation', () => {

        it('encodes days of week properly', () => {
            let encoder = new WeekendEncoder({
                w: 3,
            })
            let mockMon = {}
            mockMon.getDay = () => { return 1 }
            let mockTue = {}
            mockTue.getDay = () => { return 2 }
            let mockWed = {}
            mockWed.getDay = () => { return 3 }
            let mockThu = {}
            mockThu.getDay = () => { return 4 }
            let mockFri = {}
            mockFri.getDay = () => { return 5 }
            let mockSat = {}
            mockSat.getDay = () => { return 6 }
            let mockSun = {}
            mockSun.getDay = () => { return 0 }

            expect(encoder.encode(mockMon)).to.deep.equal([1,1,1,0,0,0])
            expect(encoder.encode(mockTue)).to.deep.equal([1,1,1,0,0,0])
            expect(encoder.encode(mockWed)).to.deep.equal([1,1,1,0,0,0])
            expect(encoder.encode(mockThu)).to.deep.equal([1,1,1,0,0,0])
            expect(encoder.encode(mockFri)).to.deep.equal([1,1,1,0,0,0])
            expect(encoder.encode(mockSat)).to.deep.equal([0,0,0,1,1,1])
            expect(encoder.encode(mockSun)).to.deep.equal([0,0,0,1,1,1])
        })

    })

})
