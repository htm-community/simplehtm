let d3 = require('d3')

const assert = require('chai').assert
const expect = require('chai').expect
const SpatialPooler = require('../../../src/algorithms/spatialPooler')
const connectedPercTestCases = [1, .75, .5, .25, 0.1]
const defaultInputCount = 500
const defaultSpSize = 200

describe('upon SP instantiation', () => {

	describe('when creating potential pools', () => {

		connectedPercTestCases.forEach(connectedPercent => {

			describe(`with ${connectedPercent * 100}% connectivity`, () => {

				// How close should the pool be to expected connectivity?
				const testTolerance = 0.1

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
		const inputCount = defaultInputCount
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
						const testTolerance = 0.05 + (1 - connectedPercent) * 0.1

						it('contains minicolumn permanences', () => {
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
			
						it('permanences are normally distributed around specified c enter', () => {
							allPerms.forEach((perms, minicolumnIndex) => {
								const avg = d3.mean(perms)
		
								assert.closeTo(distributionCenter, avg, testTolerance, 
									`Average permanence across minicolumn ${minicolumnIndex} should be centered at of ${distributionCenter}`)
			
								// const sortedPerms = perms.slice().sort()
								// const sampleWidth = Math.floor(sortedPerms.length * 0.1)
								// const midIndex = Math.floor(sortedPerms.length / 2)
								// const halfSample = Math.floor(sortedPerms / 2)
			
								// const first10Percent = sortedPerms.slice(0, sampleWidth)
								// const last10Percent = sortedPerms.slice(sortedPerms.length - sampleWidth)
								// const middle10Percent = sortedPerms.slice(midIndex - halfSample, midIndex + halfSample)
			
								// assert.closeTo(d3.mean(first10Percent), d3.mean(last10Percent), 0.1)
							})
						})
	
					})

				})

			})
		})

	})

})
