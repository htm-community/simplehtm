const assert = require('chai').assert
const expect = require('chai').expect
const ScalarEncoder = require('../../../src/encoders/scalar')

describe('scalar encoders', () => {

    describe('when created with min/max', () => {

        describe('and w=1', () => {
            it('when w=1 n=2 range=100 encodes 1 output bit at correct index', () => {
                let encoder = new ScalarEncoder({
                    min: 0, max: 100,
                    w: 1, n: 2,
                    bounded: false,
                })
                expect(encoder.encode(0)).to.deep.equal([1,0])
                expect(encoder.encode(49)).to.deep.equal([1,0])
                expect(encoder.encode(50)).to.deep.equal([0,1])
                expect(encoder.encode(100)).to.deep.equal([0,1])
            })

            it('when w=1 n=4 0-1 range encodes 1 output bit at correct index', () => {
                let encoder = new ScalarEncoder({
                    min: 0, max: 1,
                    w: 1, n: 4,
                    bounded: false,
                })
                expect(encoder.encode(0)).to.deep.equal([1,0,0,0])
                expect(encoder.encode(0.24)).to.deep.equal([1,0,0,0])
                expect(encoder.encode(0.25)).to.deep.equal([0,1,0,0])
                expect(encoder.encode(0.49)).to.deep.equal([0,1,0,0])
                expect(encoder.encode(0.5)).to.deep.equal([0,0,1,0])
                expect(encoder.encode(0.74)).to.deep.equal([0,0,1,0])
                expect(encoder.encode(0.75)).to.deep.equal([0,0,0,1])
                expect(encoder.encode(1)).to.deep.equal([0,0,0,1])
            })

            it('when w=1 n=8 0-10 range encodes 1 output bit at correct index', () => {
                let encoder = new ScalarEncoder({
                    min: 1, max: 10,
                    w: 1, n: 10,
                    bounded: false,
                })
                expect(encoder.encode(1)).to.deep.equal([1,0,0,0,0,0,0,0,0,0])
                expect(encoder.encode(2)).to.deep.equal([0,1,0,0,0,0,0,0,0,0])
                expect(encoder.encode(3)).to.deep.equal([0,0,1,0,0,0,0,0,0,0])
                expect(encoder.encode(4)).to.deep.equal([0,0,0,1,0,0,0,0,0,0])
                expect(encoder.encode(5)).to.deep.equal([0,0,0,0,1,0,0,0,0,0])
                expect(encoder.encode(6)).to.deep.equal([0,0,0,0,0,1,0,0,0,0])
                expect(encoder.encode(7)).to.deep.equal([0,0,0,0,0,0,1,0,0,0])
                expect(encoder.encode(8)).to.deep.equal([0,0,0,0,0,0,0,1,0,0])
                expect(encoder.encode(9)).to.deep.equal([0,0,0,0,0,0,0,0,1,0])
                expect(encoder.encode(10)).to.deep.equal([0,0,0,0,0,0,0,0,0,1])
            })
        })

        describe('and w>1 not bounded', () => {
            it('has 5 output bits on when w=5', () => {
                let encoder = new ScalarEncoder({
                    min: 0, max: 1,
                    w: 5, n: 10,
                    bounded: false,
                })
                expect(encoder.encode(0)).to.deep.equal([1,1,1,0,0,0,0,0,0,0])
                expect(encoder.encode(0.5)).to.deep.equal([0,0,0,1,1,1,1,1,0,0])
                expect(encoder.encode(1)).to.deep.equal([0,0,0,0,0,0,0,1,1,1])
            })
        })

    })

    describe('when created with resolution', () => {

        describe('and w=1', () => {
            it('when w=1 n=2 range=100 encodes 1 output bit at correct index', () => {
                let encoder = new ScalarEncoder({
                    resolution: 50,
                    w: 1, n: 2,
                    bounded: false,
                })
                expect(encoder.encode(0)).to.deep.equal([1, 0])
                expect(encoder.encode(49)).to.deep.equal([1, 0])
                expect(encoder.encode(50)).to.deep.equal([0, 1])
                expect(encoder.encode(100)).to.deep.equal([0, 1])
            })

            it('when w=1 n=4 0-1 range encodes 1 output bit at correct index', () => {
                let encoder = new ScalarEncoder({
                    resolution: 0.25,
                    w: 1, n: 4,
                    bounded: false,
                })
                expect(encoder.encode(0)).to.deep.equal([1, 0, 0, 0])
                expect(encoder.encode(0.24)).to.deep.equal([1, 0, 0, 0])
                expect(encoder.encode(0.25)).to.deep.equal([0, 1, 0, 0])
                expect(encoder.encode(0.49)).to.deep.equal([0, 1, 0, 0])
                expect(encoder.encode(0.5)).to.deep.equal([0, 0, 1, 0])
                expect(encoder.encode(0.74)).to.deep.equal([0, 0, 1, 0])
                expect(encoder.encode(0.75)).to.deep.equal([0, 0, 0, 1])
                expect(encoder.encode(1)).to.deep.equal([0, 0, 0, 1])
            })

            it('when w=1 n=8 0-10 range encodes 1 output bit at correct index', () => {
                let encoder = new ScalarEncoder({
                    resolution: 1.1111111,
                    w: 1, n: 10,
                    bounded: false,
                })
                expect(encoder.encode(1)).to.deep.equal([1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                expect(encoder.encode(2)).to.deep.equal([0, 1, 0, 0, 0, 0, 0, 0, 0, 0])
                expect(encoder.encode(3)).to.deep.equal([0, 0, 1, 0, 0, 0, 0, 0, 0, 0])
                expect(encoder.encode(4)).to.deep.equal([0, 0, 0, 1, 0, 0, 0, 0, 0, 0])
                expect(encoder.encode(5)).to.deep.equal([0, 0, 0, 0, 1, 0, 0, 0, 0, 0])
                expect(encoder.encode(6)).to.deep.equal([0, 0, 0, 0, 0, 1, 0, 0, 0, 0])
                expect(encoder.encode(7)).to.deep.equal([0, 0, 0, 0, 0, 0, 1, 0, 0, 0])
                expect(encoder.encode(8)).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 1, 0, 0])
                expect(encoder.encode(9)).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 1, 0])
                expect(encoder.encode(10)).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
            })

        })

        describe('and w>1 not bounded', () => {
            it('has 5 output bits on when w=5', () => {
                let encoder = new ScalarEncoder({
                    min: 0, max: 1,
                    w: 5, n: 10,
                    bounded: false,
                })
                expect(encoder.encode(0)).to.deep.equal([1,1,1,0,0,0,0,0,0,0])
                expect(encoder.encode(0.5)).to.deep.equal([0,0,0,1,1,1,1,1,0,0])
                expect(encoder.encode(1)).to.deep.equal([0,0,0,0,0,0,0,1,1,1])
            })
        })

    })

})
