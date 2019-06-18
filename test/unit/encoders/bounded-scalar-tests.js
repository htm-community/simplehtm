const assert = require('chai').assert
const expect = require('chai').expect
const BoundedScalarEncoder = require('../../../src/encoders/boundedScalar')

describe('scalar encoders', () => {

    describe('when created with min/max', () => {

        describe('and w>1 bounded', () => {
            it('has 5 output bits on when w=5', () => {
                let encoder = new BoundedScalarEncoder({
                    min: 0, max: 1,
                    w: 5, n: 10,
                })
                expect(encoder.encode(0)).to.deep.equal([1,1,1,1,1,0,0,0,0,0])
                expect(encoder.encode(0.5)).to.deep.equal([0,0,0,1,1,1,1,1,0,0])
                expect(encoder.encode(1)).to.deep.equal([0,0,0,0,0,1,1,1,1,1])
            })
        })

    })

    describe('when created with resolution', () => {

        describe('and w>1 bounded', () => {
            it('has 5 output bits on when w=5', () => {
                let encoder = new BoundedScalarEncoder({
                    resolution: 0.1,
                    w: 5, n: 10,
                })
                expect(encoder.encode(0)).to.deep.equal([1, 1, 1, 1, 1, 0, 0, 0, 0, 0])
                expect(encoder.encode(0.5)).to.deep.equal([0, 0, 0, 1, 1, 1, 1, 1, 0, 0])
                expect(encoder.encode(1)).to.deep.equal([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])
            })
        })

    })

})
