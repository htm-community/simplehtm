const assert = require('chai').assert

const d3 = require('d3')

const SpatialPooler = require('../../../src/algorithms/spatialPooler')

const defaultInputCount = 500
const defaultSpSize = 200

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
