const assert = require('chai').assert

const d3 = require('d3')

const SpatialPooler = require('../../../src/algorithms/spatialPooler')

const defaultInputCount = 500
const defaultSpSize = 200

describe('upon SP instantiation', () => {

	const connectedPercTestCases = [0.1, .3, .6, 1]

	describe('when establishing initial permanences', () => {

		connectedPercTestCases.forEach(connectedPercent => {

			describe(`with ${connectedPercent * 100}% connectivity`, () => {

				[0.3, 0.5, 0.6].forEach(distributionCenter => {

					describe(`around distribution center ${distributionCenter}`, () => {

						const sp = new SpatialPooler({
							// Assume 1D input, global inhibition, no topology
							inputCount: defaultInputCount,
							// Assume 1D input, global inhibition, no topology
							size: defaultSpSize,
							connectedPercent: connectedPercent,
							distributionCenter: distributionCenter,
						})
						const allPerms = sp.getPermanences()
						const pools = sp.getPotentialPools()

						it('contains minicolumn permanences', function () {
							this.timeout(0)
							assert.lengthOf(allPerms, sp.opts.size,
								'perms should be same size as minicolumn count')
							allPerms.forEach((perms, minicolumnIndex) => {
								const pool = pools[minicolumnIndex]
								assert.lengthOf(perms, pool.length,
									`minicolumn ${minicolumnIndex} perms did not match its potential pool`)
								perms.forEach((permanence, poolIndex) => {
									const inputIndex = pools[minicolumnIndex][poolIndex]
									assert.isAtMost(inputIndex, sp.opts.inputCount,
										'associated perm input index must be within input range')
									assert.isAtMost(permanence, 1.0,
										'permanence value cannot be larger than 1.0')
									assert.isAtLeast(permanence, 0.0,
										'permanence value cannot be smaller than 0.0')
								})
							})
						})

						it('permanences are normally distributed around specified center', () => {
							// Lower connectionPercent means fewer connections to average across,
							// so we need to add more tolerance for these.
							const testTolerance = 0.05 + (1 - connectedPercent) * 0.1
							allPerms.forEach((perms, minicolumnIndex) => {
								assert.closeTo(d3.mean(perms), distributionCenter, testTolerance,
									`Average permanence across ${perms.length} permanences should be centered at ${distributionCenter}`)
							})
						})
					})
				})
			})
		})
	})

	describe('permanences are always the same between computations', () => {
		const inputCount = defaultInputCount
		const spSize = defaultSpSize
		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			inputCount: inputCount,
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			connectedPercent: .85,
		})

		const perms1 = sp.getPermanences()
		const perms2 = sp.getPermanences()

		assert.deepEqual(perms1, perms2, 'permanences should not change between computations')

	})

})
