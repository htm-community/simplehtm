const assert = require('chai').assert

const SpatialPooler = require('../../../src/algorithms/spatialPooler')

const defaultSpSize = 10

describe('when calculating active duty cycles', () => {

	const spSize = defaultSpSize

	describe('with no period (not a moving average)', () => {

		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			size: spSize,
		})

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

	describe('with a period (moving average)', () => {

		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			dutyCyclePeriod: 2,
		})

		const firstWinners = [
			{index: 3},
			{index: 7},
		]
		const secondWinners = [
			{index: 4},
			{index: 8},
		]

		// let adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)
		// adcs = sp.computeActiveDutyCycles(firstWinners)

		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners)
		// adcs = sp.computeActiveDutyCycles(secondWinners);

		// [4, 8].forEach(i => {
		// 	assert.closeTo(adcs[i], 1.0, 0.001, 
		// 		`Last two cycles of index ${i} should have been on, so ADC should be 1.0 when period is 2`)
		// });

		// [0, 1, 2, 3, 5, 6, 7, 9].forEach(i => {
		// 	assert.closeTo(adcs[i], 0.0, 0.001,
		// 		`Last two cycles of index ${i} should have been off, so ADC should be 0.0 when period is 2`)
		// });


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
			const adcs = sp.computeActiveDutyCycles(secondWinners);

			/*
			i  1  2 
			0   
			1
			2
			3  X
			4     X 
			5
			6
			7  X
			8     X 
			9

			If the period is 2, after seeing the above pattern, we should expect:

			i
			0: 0
			1: 0
			2: 0
			3: 0.5
			4: 0.5
			5: 0
			6: 0
			7: 0.5
			8: 0.5
			9: 0

			*/

			[3, 4, 7, 8].forEach(i => {
				assert.equal(adcs[i], 0.5, 
					`Last two cycles of index ${i} should have been on, so ADC should be 0.5 when period is 2`)
			});

			[0, 1, 2, 5, 6, 9].forEach(i => {
				assert.equal(adcs[i], 0.0, 
					`Last two cycles of index ${i} should have been off, so ADC should be 0.0 when period is 2`)
			})

		})

		it('on third compute with new winners', () => {
			const adcs = sp.computeActiveDutyCycles(secondWinners);

			/*
			i  1  2  3  
			0   
			1
			2
			3  X
			4     X  X
			5
			6
			7  X
			8     X  X
			9

			If the period is 2, after seeing the above pattern, we should expect:

			i
			0: 0
			1: 0
			2: 0
			3: 0.25
			4: 0.75
			5: 0
			6: 0
			7: 0.25
			8: 0.75
			9: 0

			*/

			[4, 8].forEach(i => {
				assert.equal(adcs[i], 0.75, 
					`Last two cycles of index ${i} should have been on, so ADC should be 0.75 when period is 2`)
			});

			[3, 7].forEach(i => {
				assert.equal(adcs[i], 0.25, 
					`Last two cycles of index ${i} should have been on, so ADC should be 0.25 when period is 2`)
			});

			[0, 1, 2, 5, 6, 9].forEach(i => {
				assert.equal(adcs[i], 0, 
					`Last two cycles of index ${i} should have been off, so ADC should be 0.0 when period is 2`)
			})

		})

	})

})
