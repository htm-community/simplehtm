const assert = require('chai').assert

const SpatialPooler = require('../../../src/algorithms/spatialPooler')

const defaultInputCount = 500
const defaultSpSize = 200

describe('upon SP instantiation', () => {

	const connectedPercTestCases = [0.1, .3, .6, 1]

	describe('when creating potential pools', () => {

		// Loop over a range of connected percents
		connectedPercTestCases.forEach(connectedPercent => {

			describe(`with ${connectedPercent * 100}% connectivity`, () => {

				// Lower connectionPercent means fewer connections to average across,
				// so we need to add more tolerance for these.
				const testTolerance = 0.05 + (1 - connectedPercent) * 0.1

				const inputCount = defaultInputCount
				const spSize = defaultSpSize
				const sp = new SpatialPooler({
					// Assume 1D input, global inhibition, no topology
					inputCount: inputCount,
					// Assume 1D input, global inhibition, no topology
					size: spSize,
					connectedPercent: connectedPercent,
				})

				it('contains potential pool indices', () => {
					const pools = sp.getPotentialPools()
					assert.lengthOf(pools, spSize,
						'pools should be same size as minicolumn count')
					pools.forEach(p => {
						p.forEach(poolIndex => {
							// all indices are within range of input space
							assert.isBelow(poolIndex, inputCount,
								'pool index out of input range')
						})
						assert.closeTo(p.length, inputCount * connectedPercent, inputCount * testTolerance,
							`potential pool size should be approx ${connectedPercent} of the input space`)
						assert.equal(new Set(p).size, p.length,
							'potential pool contains non-unique indices')
					})
				})
			})
		})
	})

	describe('less than 100% connected potential pools are always the same', () => {
		const inputCount = defaultInputCount * 2
		const spSize = defaultSpSize
		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			inputCount: inputCount,
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			connectedPercent: .85,
		})

		const pool1 = sp.getPotentialPools()
		const pool2 = sp.getPotentialPools()

		assert.deepEqual(pool1, pool2, 'potential pools should always be the same')

	})

})