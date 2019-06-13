const assert = require('chai').assert

const d3 = require('d3')

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

describe('when calculating overlaps', () => {

	const inputSaturations = [0.1, .3, .6, .1]

	const inputCount = defaultInputCount * 2
	const spSize = defaultSpSize
	const connectionThreshold = 0.5
	const connectedPercent = 0.85
	const sp = new SpatialPooler({
		// Assume 1D input, global inhibition, no topology
		inputCount: inputCount,
		// Assume 1D input, global inhibition, no topology
		size: spSize,
		connectedPercent: connectedPercent,
		connectionThreshold: connectionThreshold,
	})

	inputSaturations.forEach(inputSaturation => {

		describe(`when input is ${inputSaturation * 100}% saturated`, () => {
			const input = []
			for (let x = 0; x < inputCount; x++) {
				input.push(Math.random() < inputSaturation ? 1 : 0)
			}
			it('overlap is within acceptable limits', () => {
				for (let mcIndex = 0; mcIndex < spSize; mcIndex++) {
					const overlapIndices = sp.calculateOverlap(mcIndex, input)
					assert.isAtMost(Math.max(...overlapIndices), inputCount - 1,
						'overlap index is above input range')
					assert.isAtLeast(Math.min(...overlapIndices), 0,
						'overlap index is below input range')
					assert.equal(new Set(overlapIndices).size, overlapIndices.length,
						'overlap contains non-unique indices')
					const overlap = overlapIndices.length
					const perms = sp.getPermanences()[mcIndex]
					const totalConnections = perms.reduce((cons, perm) => {
						let out = cons
						if (perm >= connectionThreshold) {
							out += 1
						}
						return out
					}, 0)
					assert.isAtMost(overlap, totalConnections,
						'overlap should not be more than current connection count')
					const observedOverlapPerc = overlap / totalConnections
					assert.closeTo(observedOverlapPerc, inputSaturation, 0.1,
						`observed overlap percent of total connections should be similar to input saturation`)
				}
			})
		})

	})

})

describe('during minicolumn competition', () => {

	[1, 10, 40, 100].forEach(winnerCount => {

		const inputCount = defaultInputCount
		const spSize = defaultSpSize
		const connectionThreshold = 0.5
		const connectedPercent = 0.85
		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			inputCount: inputCount,
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			connectedPercent: connectedPercent,
			connectionThreshold: connectionThreshold,
			winnerCount: winnerCount,
		})

		describe(`with ${winnerCount} winning minicolumns`, () => {

			[0.1, .3, .6, 1].forEach(inputSaturation => {

				describe(`input saturation ${inputSaturation * 100}%`, () => {

					it('minicolumns with most overlap win', () => {
						const input = []
						for (let x = 0; x < inputCount; x++) {
							input.push(Math.random() < inputSaturation ? 1 : 0)
						}

						const winners = sp.compete(input)

						assert.isArray(winners, 'SP competition result must be an array')
						assert.lengthOf(winners, winnerCount, 'wrong minicolumn competition winner count')

						winners.forEach(winner => {
							for (let x = 0; x < sp.opts.size; x++) {
								// only test against losers
								if (!winners.map(v => v.index).indexOf(x)) {
									assert.isAtLeast(winner.overlap.length, sp.calculateOverlap(x, input).length,
										'all winner minicolumns must have higher overlap scores than losers')
								}
							}
						})
					})
				})
			})
		})
	})
})
