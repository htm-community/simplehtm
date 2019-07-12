let d3 = require('d3')

class SpatialPooler {

	constructor(opts) {
		this.opts = opts
		this._batesFn = d3.randomBates(this.opts.batesIndependentVariables || 10)
		this._batesCenter = this.opts.distributionCenter || 0.5
		this._potentialPools = this._createPotentialPools()
		this._permanences = this._createPermanences()
		this._learningEnabled = !!this.opts.learn
		this._adcs = this._createEmptyDutyCycles()
		this._odcs = this._createEmptyDutyCycles()
		this._computeCount = 0
		this._maxDutyCyclePeriod = 1000
	}

	getPotentialPools() {
		return this._potentialPools
	}

	getPermanences() {
		const permCopy = []
		this._permanences.forEach(perms => {
			permCopy.push(perms.slice())
		})
		return permCopy
	}

	getOverlaps() {
		return this._overlaps
	}

	getActiveDutyCycles() {
		return this._adcs
	}

	getMeanActiveDutyCycles() {
		return this._meanDutyCycle(this._adcs)
	}

	getOverlapDutyCycles() {
		return this._odcs
	}

	getMeanOverlapDutyCycles() {
		return this._meanDutyCycle(this._odcs)
	}

	disableLearning() {
		this._learningEnabled = false
	}

	enableLearning() {
		this._learningEnabled = true
	}

	compete(input) {
		this._overlaps = []
		const overlaps = []
		const me = this
		const allPools = this._potentialPools
		const permanenceInc = this.opts.permanenceInc
		const permanenceDec = this.opts.permanenceDec
		this._computeCount++
		for (let mcIndex = 0; mcIndex < this.opts.size; mcIndex++) {
			const overlap = this.calculateOverlap(mcIndex, input)
			overlaps.push({
				index: mcIndex,
				overlap: overlap,
			})
			// This allows a simple structure for retreival from API
			this._overlaps.push(overlap)
		}

		// Sort by overlap score
		overlaps.sort((a, b) => {
			if (a.overlap.length < b.overlap.length) return -1
			if (a.overlap.length > b.overlap.length) return 1
			return 0
		})

		const winners = overlaps.slice(overlaps.length - this.opts.winnerCount)

		if (this._learningEnabled) {
			winners.forEach(winner => {
				const overlap = winner.overlap
				const pool = allPools[winner.index]
				const perms = me._permanences[winner.index]
				perms.forEach((_, poolIndex) => {
					const inputIndex = pool[poolIndex]
					const perm = perms[poolIndex]
					if (overlap.includes(inputIndex)) {
						// increment perms only of connections that overlap, no more than 1
						perms[poolIndex] = Math.min(perm + permanenceInc, 1)
					} else {
						// decrement perms for non-overlapping connections, no less than 0
						perms[poolIndex] = Math.max(perm - permanenceDec, 0)
					}
				})
			})
		}

		this.computeOverlapDutyCycles(overlaps)
		this.computeActiveDutyCycles(winners)

		return winners
	}

	calculateOverlap(minicolumnIndex, input) {
		const pool = this.getPotentialPools()[minicolumnIndex]
		const perms = this.getPermanences()[minicolumnIndex]
		let overlap = []
		perms.forEach((perm, permIndex) => {
			const inputIndex = pool[permIndex]
			if (input[inputIndex] == 1 && perm >= this.opts.connectionThreshold) {
				overlap.push(inputIndex)
			}
		})
		return overlap
	}

	computeActiveDutyCycles(winners) {
		const binaryWinners = []
		const winnerIndices = winners.map(w => w.index)
		for (let mcIndex = 0; mcIndex < this.opts.size; mcIndex++) {
			let bit = 0
			if (winnerIndices.includes(mcIndex)) {
				bit = 1
			}
			binaryWinners.push(bit)
		}
		this._updateDutyCycles(this._adcs, binaryWinners)
	}

	computeOverlapDutyCycles(overlaps) {
		const perMinicolumnOverlap = []
		for (let mcIndex = 0; mcIndex < this.opts.size; mcIndex++) {
			perMinicolumnOverlap.push(0)
		}
		overlaps.forEach(overlap => {
			perMinicolumnOverlap[overlap.index] = overlap.overlap.length
		})
		this._updateDutyCycles(this._odcs, perMinicolumnOverlap)
		return this._meanDutyCycle(this._odcs)
	}

	_computeDutyCyclePeriod() {
		let period = this.opts.dutyCyclePeriod !== undefined
			? this.opts.dutyCyclePeriod : this._computeCount
		if (period > this._computeCount) {
			period = this._computeCount
		}
		return Math.min(period, this._maxDutyCyclePeriod)
	}

	_updateDutyCycles(dutyCycles, newInput) {
		for (let mcIndex = 0; mcIndex < this.opts.size; mcIndex++) {
			const dutyCycle = dutyCycles[mcIndex]
			// Moving window
			if (dutyCycle.length >= this._maxDutyCyclePeriod) {
				dutyCycle.shift()
			}
			dutyCycle.push(newInput[mcIndex])
		}
	}

	_meanDutyCycle(dutyCycles) {
		const period = this._computeDutyCyclePeriod()
		return dutyCycles.map(cycle => {
			const cyclePeriod = Math.min(cycle.length, period)
			const sum = cycle.slice(cycle.length - cyclePeriod).reduce((accumulator, currentValue) => {
				return accumulator + currentValue
			})
			return sum / cyclePeriod
		})
	}

	_createPotentialPools() {
		let pools = []
		for (let i = 0; i < this.opts.size; i++) {
			let pool = []
			for (let j = 0; j < this.opts.inputCount; j++) {
				if (Math.random() < this.opts.connectedPercent) {
					pool.push(j)
				}
			}
			pools.push(pool)
		}
		return pools
	}

	_createPermanences() {
		const pools = this.getPotentialPools()
		const allPerms = []
		pools.forEach(pool => {
			const perms = []
			pool.forEach(_ => {
				let perm = this._batesFn() + this._batesCenter - 0.5
				if (perm > 1) perm = 1
				if (perm < 0) perm = 0
				perms.push(perm)
			})
			allPerms.push(perms)
		})
		return allPerms
	}

	_createEmptyDutyCycles() {
		const dutyCycles = []
		for (let i = 0; i < this.opts.size; i++) {
			dutyCycles.push([])
		}
		return dutyCycles
	}

}

module.exports = SpatialPooler
