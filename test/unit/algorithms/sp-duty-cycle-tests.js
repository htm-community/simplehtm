const assert = require('chai').assert

const SpatialPooler = require('../../../src/algorithms/spatialPooler')

const defaultSpSize = 10

describe('active duty cycles', () => {

	const spSize = defaultSpSize

	describe('with no period (not a moving average)', () => {

		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			size: spSize,
		})

		const firstWinners = [
			{ index: 3 },
			{ index: 7 },
		]
		const firstIndices = firstWinners.map(w => w.index)
		const secondWinners = [
			{ index: 4 },
			{ index: 8 },
		]
		const secondIndices = secondWinners.map(w => w.index)

		it('on first computation', () => {
			// mock out the competition
			sp._computeCount++
			sp.computeActiveDutyCycles(firstWinners)
			const adcs = sp.getMeanActiveDutyCycles()
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
			// mock out the competition
			sp._computeCount++
			sp.computeActiveDutyCycles(firstWinners)
			const adcs = sp.getMeanActiveDutyCycles()
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
			// mock out the competition
			sp._computeCount++
			sp.computeActiveDutyCycles(secondWinners)
			const adcs = sp.getMeanActiveDutyCycles()

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
			{ index: 3 },
			{ index: 7 },
		]
		const secondWinners = [
			{ index: 4 },
			{ index: 8 },
		]

		it('on first computation', () => {
			// mock out the competition
			sp._computeCount++
			sp.computeActiveDutyCycles(firstWinners)
			const adcs = sp.getMeanActiveDutyCycles()
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

		it('on second compute with different winners', () => {
			// mock out the competition
			sp._computeCount++
			sp.computeActiveDutyCycles(secondWinners)
			const adcs = sp.getMeanActiveDutyCycles();

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
			sp.computeActiveDutyCycles(secondWinners)
			const adcs = sp.getMeanActiveDutyCycles();

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
			3: 0
			4: 1
			5: 0
			6: 0
			7: 0
			8: 1
			9: 0

			*/

			[4, 8].forEach(i => {
				assert.equal(adcs[i], 1,
					`Last two cycles of index ${i} should have been on, so ADC should be 1 when period is 2`)
			});

			[0, 1, 2, 3, 5, 6, 7, 9].forEach(i => {
				assert.equal(adcs[i], 0,
					`Last two cycles of index ${i} should have been off, so ADC should be 0.0 when period is 2`)
			})

		})

	})

	it('are stored and accessible after competition history', () => {
		const inputCount = 100
		const spSize = 10
		const connectionThreshold = 0.5
		const connectedPercent = 1.0
		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			inputCount: inputCount,
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			connectedPercent: connectedPercent,
			connectionThreshold: connectionThreshold,
			learn: false,
		})

		let input = []
		for (let x = 0; x < inputCount; x++) {
			input.push(1)
		}

		sp.compete(input)

		sp.getMeanActiveDutyCycles().forEach(activeDutyCycle => {
			assert.equal(activeDutyCycle, 1.0,
				'Activity should be 100% when input is fully saturated and potential pool is 100%')
		})

	})


})

describe('overlap duty cycles', () => {

	describe('with a period (moving average)', () => {

		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			size: 10,
			inputCount: 10,
			dutyCyclePeriod: 2,
		})

		const firstOverlaps = [
			{ index: 3, overlap: { length: 3 } },
			{ index: 7, overlap: { length: 7 } },
		]
		const secondOverlaps = [
			{ index: 4, overlap: { length: 4 } },
			{ index: 8, overlap: { length: 8 } },
		]

		it('on first computation', () => {
			// mock out the competition
			sp._computeCount++
			sp.computeOverlapDutyCycles(firstOverlaps)
			const odcs = sp.getMeanOverlapDutyCycles()

			assert.lengthOf(odcs, 10,
				'Active duty cycles should be same dimension of SP')

			assert.equal(odcs[0], 0)
			assert.equal(odcs[1], 0)
			assert.equal(odcs[2], 0)
			assert.equal(odcs[3], 3)
			assert.equal(odcs[4], 0)
			assert.equal(odcs[5], 0)
			assert.equal(odcs[6], 0)
			assert.equal(odcs[7], 7)
			assert.equal(odcs[8], 0)
			assert.equal(odcs[9], 0)

		})

		it('on second compute with different overlaps', () => {
			// mock out the competition
			sp._computeCount++
			sp.computeOverlapDutyCycles(secondOverlaps)
			const odcs = sp.getMeanOverlapDutyCycles()

			/*
			i  1  2 
			0   
			1
			2
			3  3
			4     4 
			5
			6
			7  7
			8     8 
			9

			If the period is 2, after seeing the above pattern, we should expect:

			i
			0: 0
			1: 0
			2: 0
			3: 1.5
			4: 2
			5: 0
			6: 0
			7: 3.5
			8: 4
			9: 0

			*/

			assert.equal(odcs[0], 0)
			assert.equal(odcs[1], 0)
			assert.equal(odcs[2], 0)
			assert.equal(odcs[3], 1.5)
			assert.equal(odcs[4], 2)
			assert.equal(odcs[5], 0)
			assert.equal(odcs[6], 0)
			assert.equal(odcs[7], 3.5)
			assert.equal(odcs[8], 4)
			assert.equal(odcs[9], 0)

		})

		it('on third compute with same overlaps', () => {
			// mock out the competition
			sp._computeCount++
			sp.computeOverlapDutyCycles(secondOverlaps)
			const odcs = sp.getMeanOverlapDutyCycles()

			/*
			i  1  2  3
			0   
			1
			2
			3  3
			4     4  4
			5
			6
			7  7
			8     8  8
			9

			If the period is 2, after seeing the above pattern, we should expect:

			i
			0: 0
			1: 0
			2: 0
			3: 0
			4: 4
			5: 0
			6: 0
			7: 0
			8: 8
			9: 0

			*/

			assert.equal(odcs[0], 0)
			assert.equal(odcs[1], 0)
			assert.equal(odcs[2], 0)
			assert.equal(odcs[3], 0)
			assert.equal(odcs[4], 4)
			assert.equal(odcs[5], 0)
			assert.equal(odcs[6], 0)
			assert.equal(odcs[7], 0)
			assert.equal(odcs[8], 8)
			assert.equal(odcs[9], 0)

		})

	})

	it('are stored and accessible after competition history', () => {

		const inputCount = 100
		const spSize = 10
		const connectionThreshold = 0.0
		const connectedPercent = 1.0
		const sp = new SpatialPooler({
			// Assume 1D input, global inhibition, no topology
			inputCount: inputCount,
			// Assume 1D input, global inhibition, no topology
			size: spSize,
			connectedPercent: connectedPercent,
			connectionThreshold: connectionThreshold,
			learn: false,
		})

		let input = []
		for (let x = 0; x < inputCount; x++) {
			input.push(1)
		}

		sp.compete(input)

		sp.getMeanOverlapDutyCycles().forEach(overlayDutyCycle => {
			assert.equal(overlayDutyCycle, 100,
				'Overlap should be 100% when input is fully saturated and potential pool is 100%')
		})

	})
})
