let d3 = require('d3')

class SpatialPooler {

	constructor(opts) {
		this.opts = opts
		this._batesFn = d3.randomBates(this.opts.batesIndependentVariables || 10)
		this._batesCenter = this.opts.distributionCenter || 0.5
		this._potentialPools = this._createPotentialPools()
		this._permanences = this._createPermanences()
		this._learningEnabled = !!this.opts.learn
		this._adcs = this._createActiveDutyCycles()
		this._computeCount = 0
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
		this._computeCount++
		const out = []
		const winnerIndices = winners.map(w => w.index)
		for (let mcIndex = 0; mcIndex < this.opts.size; mcIndex++) {
			if (winnerIndices.includes(mcIndex)) {
				this._adcs[mcIndex]++
			}
			out.push(this._adcs[mcIndex] / this._computeCount)
		}
		return out
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

	_createActiveDutyCycles() {
		const adcs = []
		for (let i = 0; i < this.opts.size; i++) {
			adcs.push(0)
		}
		return adcs
	}

}

module.exports = SpatialPooler
