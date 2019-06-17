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

	// inputSaturations.forEach(inputSaturation => {

	// 	describe(`when input is ${inputSaturation * 100}% saturated`, () => {
	// 		const input = []
	// 		for (let x = 0; x < inputCount; x++) {
	// 			input.push(Math.random() < inputSaturation ? 1 : 0)
	// 		}
	// 		it('overlap is within acceptable limits', () => {
	// 			for (let mcIndex = 0; mcIndex < spSize; mcIndex++) {
	// 				const overlapIndices = sp.calculateOverlap(mcIndex, input)
	// 				assert.isAtMost(Math.max(...overlapIndices), inputCount - 1,
	// 					'overlap index is above input range')
	// 				assert.isAtLeast(Math.min(...overlapIndices), 0,
	// 					'overlap index is below input range')
	// 				assert.equal(new Set(overlapIndices).size, overlapIndices.length,
	// 					'overlap contains non-unique indices')
	// 				const overlap = overlapIndices.length
	// 				const perms = sp.getPermanences()[mcIndex]
	// 				const totalConnections = perms.reduce((cons, perm) => {
	// 					let out = cons
	// 					if (perm >= connectionThreshold) {
	// 						out += 1
	// 					}
	// 					return out
	// 				}, 0)
	// 				assert.isAtMost(overlap, totalConnections,
	// 					'overlap should not be more than current connection count')
	// 				const observedOverlapPerc = overlap / totalConnections
	// 				assert.closeTo(observedOverlapPerc, inputSaturation, 0.1,
	// 					`observed overlap percent of total connections should be similar to input saturation`)
	// 			}
	// 		})
	// 	})

	// })

})

describe('during minicolumn competition', () => {

	[1, 10, 40, 100].forEach(winnerCount => {

		const inputCount = defaultInputCount
		const spSize = defaultSpSize
		const connectionThreshold = 0.5
		const connectedPercent = 0.85
		const permanenceInc = 0.1
		const permanenceDec = 0.05
		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			inputCount: inputCount,
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			connectedPercent: connectedPercent,
			connectionThreshold: connectionThreshold,
			winnerCount: winnerCount,
			permanenceInc: permanenceInc,
			permanenceDec: permanenceDec,
			learn: false,
		})

		describe(`with ${winnerCount} winning minicolumns`, () => {

			[0.1, .3, .6, 1].forEach(inputSaturation => {

				describe(`input saturation ${inputSaturation * 100}%`, () => {

					// it('minicolumns with most overlap win', () => {
					// 	const input = []
					// 	for (let x = 0; x < inputCount; x++) {
					// 		input.push(Math.random() < inputSaturation ? 1 : 0)
					// 	}

					// 	const winners = sp.compete(input)

					// 	assert.isArray(winners, 'SP competition result must be an array')
					// 	assert.lengthOf(winners, winnerCount, 'wrong minicolumn competition winner count')

					// 	winners.forEach(winner => {
					// 		for (let x = 0; x < sp.opts.size; x++) {
					// 			// only test against losers
					// 			if (!winners.map(v => v.index).indexOf(x)) {
					// 				assert.isAtLeast(winner.overlap.length, sp.calculateOverlap(x, input).length,
					// 					'all winner minicolumns must have higher overlap scores than losers')
					// 			}
					// 		}
					// 	})
					// })

					const input = []
					for (let x = 0; x < inputCount; x++) {
						input.push(Math.random() < inputSaturation ? 1 : 0)
					}

					describe('on new input when learning enabled', () => {

						sp.enableLearning()

						describe('for winner minicolumns', () => {
							const allOriginalPerms = sp.getPermanences()
							const winners = sp.compete(input)
							const allNewPerms = sp.getPermanences()
                
							it('permanences are properly updated', () => {

								const winnerIndices = winners.map(w => w.index)

								input.forEach((inputBit, inputIndex) => {
									if (winnerIndices.includes(inputIndex)) {
										
										assert.equal(newPerm, originalPerm + permanenceInc, 
											`winner minicolumn at ${mcIndex} was not incremented for overlapping input index ${inputIndex}`)
									}
								})


								// winners.forEach(winner => {
								// 	const mcIndex = winner.index
								// 	const overlap = winner.overlap
								// 	const originalPerms = allOriginalPerms[mcIndex]
								// 	const newPerms = allNewPerms[mcIndex]

								// 	assert.notDeepEqual(newPerms, originalPerms, 'permanences should be updated')

								// 	input.forEach((inputBit, inputIndex) => {
								// 		const originalPerm = originalPerms[inputIndex]
								// 		const newPerm = newPerms[inputIndex]

								// 		if (overlap.includes(inputIndex)) {
								// 			// assert.equal(newPerm, originalPerm + permanenceInc, 
								// 			// 	`winner minicolumn at ${mcIndex} was not incremented for overlapping input index ${inputIndex}`)
								// 		} else {
								// 			// assert.equal(newPerm, originalPerm - permanenceDec, 
								// 			// 	`winner minicolumn at ${mcIndex} was not decremented for NON-overlapping input index ${inputIndex}`)
								// 		}

								// 	})
								// })
							})
						})

						describe('for loser minicolumns', () => {
							it('permanences are never changed', () => {

							})
						})

					})

					// describe('on new input when learning disabled', () => {

					// 	sp.disableLearning()

					// 	describe('for winner minicolumns', () => {
					// 		const allOriginalPerms = sp.getPermanences()
					// 		const winners = sp.compete(input)
					// 		const allNewPerms = sp.getPermanences()
	
					// 		it('permanences are NOT updated', () => {
					// 			winners.forEach(winner => {
					// 				const mcIndex = winner.index
					// 				const overlaps = winner.overlay
					// 				const originalPerms = allOriginalPerms[mcIndex]
					// 				const newPerms = allNewPerms[mcIndex]

					// 				input.forEach((inputBit, inputIndex) => {
					// 					const originalPerm = originalPerms[inputIndex]
					// 					const newPerm = newPerms[inputIndex]
					// 					assert.equal(newPerm, originalPerm, 
					// 						`winner minicolumn at ${mcIndex} at input index ${inputIndex} was updated when learning was disabled`)
					// 				})
					// 			})
					// 		})
					// 	})

					// })

				})
			})
		})
	})
})
