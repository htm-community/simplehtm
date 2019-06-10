const assert = require('chai').assert
const expect = require('chai').expect
const SpatialPooler = require('../../../src/algorithms/spatialPooler')

describe('spatial pooler instantiation', () => {

	describe('when creating potential pools', () => {

		describe('with 100% connectivity', () => {

			const inputCount = 100
			const spSize = 200
			const sp = new SpatialPooler({
				// Assume 1D input, global inhibition, no topology
				inputCount: inputCount,
				// Assume 1D input, global inhibition, no topology
				size: spSize,
				connectedPercent: 1.0,
			})
	
			it('contains potential pool indices', () => {
				const pools = sp.getPotentialPools()
				assert.lengthOf(pools, spSize, 'pools should be same size as minicolumn count')
				pools.forEach(p => {
					assert.lengthOf(p, inputCount, 'fully connected pool should be same size as input space')
					p.forEach((inputIndex, poolIndex) => {
						assert.equal(inputIndex, poolIndex, 'each pool index should match input space index')
					})
				})
			})

		})

		describe('with less connectivity', () => {

			const connectedPercTestCases = [0.25, 0.5, 0.75, 1.00]

			connectedPercTestCases.forEach(targetConnectedPerc => {

				describe(`with ${targetConnectedPerc} connectivity`, () => {

					// How close should the pool be to expected connectivity?
					const testTolerance = 0.15

					const inputCount = 200
					const spSize = 200
					const connectedPercent = targetConnectedPerc
					const sp = new SpatialPooler({
						// Assume 1D input, global inhibition, no topology
						inputCount: inputCount,
						// Assume 1D input, global inhibition, no topology
						size: spSize,
						connectedPercent: connectedPercent,
					})
			
					it('contains potential pool indices', () => {
						const pools = sp.getPotentialPools()
						assert.lengthOf(pools, spSize, 'pools should be same size as minicolumn count')
						pools.forEach(p => {
							p.forEach(poolIndex => {
								// all indices are within range of input space
								assert.isBelow(poolIndex, inputCount, 'pool index out of input range')
							})
							assert.closeTo(p.length, inputCount * connectedPercent, inputCount * testTolerance)
							assert.equal(new Set(p).size, p.length, 'pool contains non-unique indices')
						})
					})
	
				})

			})


		})

		describe('less than fully connected potential pools are always the same', () => {
			const inputCount = 100
			const spSize = 200
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

	describe('when establishing initial permanences', () => {

		describe('with 100% connectivity', () => {

			const inputCount = 100
			const spSize = 200
			const sp = new SpatialPooler({
				// Assume 1D input, global inhibition, no topology
				inputCount: inputCount,
				// Assume 1D input, global inhibition, no topology
				size: spSize,
				connectedPercent: 1.0,
			})
	
			it('contains minicolumn permanences', () => {
				const allPerms = sp.getPermanences()
				const pools = sp.getPotentialPools()
				assert.lengthOf(allPerms, spSize, 'perms should be same size as minicolumn count')
				allPerms.forEach((perms, minicolumnIndex) => {
					const inputIndices = []
					assert.lengthOf(perms, inputCount, 'fully connected perms should be same size as input space')
					perms.forEach((permanence, poolIndex) => {
						const inputIndex = pools[minicolumnIndex][poolIndex]
						assert.equal(inputIndex, poolIndex, 'each pool index should match input space index')
						inputIndices.push(inputIndex)
						assert.isAtMost(permanence, 1.0, 'permanence value cannot be larger than 1.0')
						assert.isAtLeast(permanence, 0.0, 'permanence value cannot be smaller than 0.0')
					})
					assert.lengthOf(perms, inputCount, 'fully connected perms should be same length as input space')
				})
			})

			it('permanences are normally distributed around a center point', () => {
				assert.fail('not implemented')
			})

		})

	})

})
