const assert = require('chai').assert
const expect = require('chai').expect
const SpatialPooler = require('../../../src/algorithms/spatialPooler')

describe('spatial pooler instantiation', () => {

	describe('when creating potential pools', () => {

		const inputCount = 100
		const spSize = 200
		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			inputCount: inputCount,
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			connectedPercent: 100,
		})

		describe('with 100 connectivity', () => {

			it('each minicolumn is fully connected to the input space', () => {
				const pools = sp.getPotentialPools()
				it('and contains potential pool indices', () => {
					assert.lengthOf(pools, spSize)
					pools.forEach(p => {
						assert.lengthOf(pool, inputCount)
						p.forEach((inputIndex, poolIndex) => {
							assert.equal(inputIndex, poolIndex)
						})
					})
				})
			})

		})

		describe('creates a potential pool for each minicolumn', () => {
			it('which is accessible', () => {
				const pools = sp.getPotentialPools()
				assert.isNotNull(pools)
			})
		})
	
	})

	it('creates an initial permanence value for each cell in each potential pool of each minicolumn', () => {
		assert.fail('not implemented')
	})


})
