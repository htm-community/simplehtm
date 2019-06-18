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
		learn: false,
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

	// [1, 10, 40, 100].forEach(winnerCount => {

	// 	const inputCount = defaultInputCount
	// 	const spSize = defaultSpSize
	// 	const connectionThreshold = 0.5
	// 	const connectedPercent = 0.85
	// 	const permanenceInc = 0.1
	// 	const permanenceDec = 0.05
	// 	const sp = new SpatialPooler({
	// 		// Assume 1D input, global inhibition, no topology
	// 		inputCount: inputCount,
	// 		// Assume 1D input, global inhibition, no topology
	// 		size: spSize,
	// 		connectedPercent: connectedPercent,
	// 		connectionThreshold: connectionThreshold,
	// 		winnerCount: winnerCount,
	// 		permanenceInc: permanenceInc,
	// 		permanenceDec: permanenceDec,
	// 		learn: false,
	// 	})

	// 	describe(`with ${winnerCount} winning minicolumns`, () => {

	// 		[0.1, .3, .6, 1].forEach(inputSaturation => {

	// 			describe(`input saturation ${inputSaturation * 100}%`, () => {

	// 				it('minicolumns with most overlap win', () => {
	// 					const input = []
	// 					for (let x = 0; x < inputCount; x++) {
	// 						input.push(Math.random() < inputSaturation ? 1 : 0)
	// 					}

	// 					const winners = sp.compete(input)

	// 					assert.isArray(winners, 'SP competition result must be an array')
	// 					assert.lengthOf(winners, winnerCount, 'wrong minicolumn competition winner count')

	// 					winners.forEach(winner => {
	// 						for (let x = 0; x < sp.opts.size; x++) {
	// 							// only test against losers
	// 							if (!winners.map(v => v.index).indexOf(x)) {
	// 								assert.isAtLeast(winner.overlap.length, sp.calculateOverlap(x, input).length,
	// 									'all winner minicolumns must have higher overlap scores than losers')
	// 							}
	// 						}
	// 					})
	// 				})

	// 				const input = []
	// 				for (let x = 0; x < inputCount; x++) {
	// 					input.push(Math.random() < inputSaturation ? 1 : 0)
	// 				}

	// 				describe('on new input when learning enabled', () => {

	// 					sp.enableLearning()

	// 					describe('for winner minicolumns', () => {
	// 						const allOriginalPerms = sp.getPermanences()
	// 						const winners = sp.compete(input)
	// 						const allNewPerms = sp.getPermanences()
	// 						const allPools = sp.getPotentialPools()

	// 						it('permanences are properly updated', () => {

	// 							winners.forEach(winner => {
	// 								const mcIndex = winner.index
	// 								const overlap = winner.overlap
	// 								const originalPerms = allOriginalPerms[mcIndex]
	// 								const newPerms = allNewPerms[mcIndex]
	// 								const pools = allPools[mcIndex]

	// 								assert.notDeepEqual(newPerms, originalPerms, 'permanences should be updated')

	// 								// Only loop through the pools
	// 								pools.forEach((inputIndex, poolIndex) => {
	// 									// Use the pool indices to find the right perm values
	// 									const originalPerm = originalPerms[poolIndex]
	// 									const newPerm = newPerms[poolIndex]

	// 									if (overlap.includes(inputIndex)) {
	// 										assert.equal(newPerm, originalPerm + permanenceInc,
	// 											`winner minicolumn at ${mcIndex} was not incremented for overlapping input index ${inputIndex}`)
	// 									} else {
	// 										assert.equal(newPerm, originalPerm - permanenceDec,
	// 											`winner minicolumn at ${mcIndex} was not decremented for NON-overlapping input index ${inputIndex}`)
	// 									}
	// 								})
	// 							})
	// 						})
	// 					})

	// 					describe('for loser minicolumns', () => {
	// 						const allOriginalPerms = sp.getPermanences()
	// 						const winnerIndices = sp.compete(input).map(w => w.index)
	// 						const allNewPerms = sp.getPermanences()
	// 						const allPools = sp.getPotentialPools()

	// 						it('permanences are never changed', () => {
	// 							for (let mcIndex = 0; mcIndex < sp.size; mcIndex++) {
	// 								if (!winnerIndices.includes(mcIndex)) {
	// 									const originalPerms = allOriginalPerms[mcIndex]
	// 									const newPerms = allNewPerms[mcIndex]
	// 									const pools = allPools[mcIndex]
	// 									// Only loop through the pools
	// 									pools.forEach((inputIndex, poolIndex) => {
	// 										// Use the pool indices to find the right perm values
	// 										const originalPerm = originalPerms[poolIndex]
	// 										const newPerm = newPerms[poolIndex]
	// 										assert.equal(newPerm, originalPerm,
	// 											`loser minicolumn permanence at ${mcIndex} at input index ${inputIndex} was changed`)
	// 									})
	// 								}
	// 							}
	// 						})
	// 					})

	// 				})

	// 				describe('on new input when learning disabled', () => {

	// 					sp.disableLearning()

	// 					describe('for winner minicolumns', () => {
	// 						const allOriginalPerms = sp.getPermanences()
	// 						const winners = sp.compete(input)
	// 						const allNewPerms = sp.getPermanences()

	// 						it('permanences are NOT updated', () => {
	// 							winners.forEach(winner => {
	// 								const mcIndex = winner.index
	// 								const overlaps = winner.overlay
	// 								const originalPerms = allOriginalPerms[mcIndex]
	// 								const newPerms = allNewPerms[mcIndex]

	// 								input.forEach((inputBit, inputIndex) => {
	// 									const originalPerm = originalPerms[inputIndex]
	// 									const newPerm = newPerms[inputIndex]
	// 									assert.equal(newPerm, originalPerm,
	// 										`winner minicolumn at ${mcIndex} at input index ${inputIndex} was updated when learning was disabled`)
	// 								})
	// 							})
	// 						})
	// 					})
	// 				})

	// 			})
	// 		})
	// 	})

	// })

	describe('during learning permanence values are bounded', () => {

		it('when perms are near 1.0 initially, learning caps them at 1.0', () => {
			const inputCount = defaultInputCount
			const spSize = defaultSpSize
			const sp = new SpatialPooler({
				// Assume 1D input, global inhibition, no topology
				inputCount: inputCount,
				// Assume 1D input, global inhibition, no topology
				size: spSize,
				connectedPercent: .85,
				connectionThreshold: 0.5,
				distributionCenter: 0.99,
				winnerCount: Math.floor(spSize * 0.02),
				permanenceInc: 0.5,
				permanenceDec: 0.0,
				learn: true,
			})
			const input = []
			for (let x = 0; x < inputCount; x++) {
				input.push(Math.random() < 0.5 ? 1 : 0)
			}

			sp.compete(input)

			sp.getPermanences().forEach(perms => {
				perms.forEach(perm => {
					assert.isAtMost(perm, 1.0, 'permenance value is too high')
				})
			})

		})

		it('when perms are near 0.0 initially, learning bottoms them at 0.0', () => {
			const inputCount = defaultInputCount
			const spSize = defaultSpSize
			const sp = new SpatialPooler({
				// Assume 1D input, global inhibition, no topology
				inputCount: inputCount,
				// Assume 1D input, global inhibition, no topology
				size: spSize,
				connectedPercent: .85,
				connectionThreshold: 0.5,
				distributionCenter: 0.01,
				winnerCount: Math.floor(spSize * 0.02),
				permanenceInc: 0.0,
				permanenceDec: 0.5,
				learn: true,
			})
			const input = []
			for (let x = 0; x < inputCount; x++) {
				input.push(Math.random() < 0.5 ? 1 : 0)
			}

			sp.compete(input)

			sp.getPermanences().forEach(perms => {
				perms.forEach(perm => {
					assert.isAtLeast(perm, 0.0, 'permenance value is too low')
				})
			})

		})

	})

})
