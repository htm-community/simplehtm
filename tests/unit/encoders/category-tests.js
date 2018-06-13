const assert = require('chai').assert
const expect = require('chai').expect
const CategoryEncoder = require('../../../src/encoders/category')

describe('category encoder', () => {

    describe('upon creation', () => {

        it('encodes 7 numeric categories', () => {
            let encoder = new CategoryEncoder({
                w: 3,
                categories: [1,2,3,4,5,6,7]
            })

            expect(encoder.encode(1)).to.deep.equal([1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(encoder.encode(2)).to.deep.equal([0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(encoder.encode(3)).to.deep.equal([0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0])
            expect(encoder.encode(4)).to.deep.equal([0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0])
            expect(encoder.encode(5)).to.deep.equal([0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0])
            expect(encoder.encode(6)).to.deep.equal([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0])
            expect(encoder.encode(7)).to.deep.equal([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1])
        })

        it('encodes 2 boolean categories', () => {
            let encoder = new CategoryEncoder({
                w: 3,
                categories: [true, false]
            })

            expect(encoder.encode(true)).to.deep.equal([1,1,1,0,0,0])
            expect(encoder.encode(false)).to.deep.equal([0,0,0,1,1,1])
        })

    })

})
