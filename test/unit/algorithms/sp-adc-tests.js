const assert = require('chai').assert

const SpatialPooler = require('../../../src/algorithms/spatialPooler')

const defaultSpSize = 10

describe('when calculating active duty cycles', () => {

	const spSize = defaultSpSize

	const sp = new SpatialPooler({
		// Assume 1D input, global inhibition, no topology
		size: spSize,
	})

	describe('with no window size', () => {

		const firstWinners = [
			{index: 3},
			{index: 7},
		]
		const firstIndices = firstWinners.map(w => w.index)
		const secondWinners = [
			{index: 4},
			{index: 8},
		]
		const secondIndices = secondWinners.map(w => w.index)

		it('on first computation', () => {
			
			const adcs = sp.computeActiveDutyCycles(firstWinners)
			assert.lengthOf(adcs, spSize, 
				'Active duty cycles should be same dimension of SP')
			
			const winnerIndices = firstWinners.map(w => w.index)
			adcs.forEach((adc, mcIndex) => {

				if (winnerIndices.includes(mcIndex)) {
					assert.equal(adc, 1.0, 
						`on first compute, winner ACD at ${mcIndex} should be 1.0`)
				} else {
					assert.equal(adc, 0.0, 
						`on first compute, loser ACD at ${mcIndex} should be 0.0`)
				}
			})
		})

		it('on second compute with same winners', () => {
			const adcs = sp.computeActiveDutyCycles(firstWinners)
			const winnerIndices = firstWinners.map(w => w.index)
			adcs.forEach((adc, mcIndex) => {

				if (winnerIndices.includes(mcIndex)) {
					assert.equal(adc, 1.0, 
						`on second compute, winner ACD at ${mcIndex} should be 1.0`)
				} else {
					assert.equal(adc, 0.0, 
						`on second compute, loser ACD at ${mcIndex} should be 0.0`)
				}
			})

		})

		it('on third compute with new winners', () => {
			const adcs = sp.computeActiveDutyCycles(secondWinners)

			adcs.forEach((adc, mcIndex) => {

				if (firstIndices.includes(mcIndex)) {
					assert.closeTo(adc, 0.6666, 0.01,
						`on third compute with first winners, winner ACD at ${mcIndex} should be 0.66`)
				} else if (secondIndices.includes(mcIndex)) {
					assert.closeTo(adc, 0.3333, 0.01,
						`on third compute with second winners, winner ACD at ${mcIndex} should be 0.33`)
				} else {
					assert.equal(adc, 0.0,
						`on third compute, loser ACD at ${mcIndex} should be 0.0`)
				}

			})

		})


	})

})
