let d3 = require('d3')

class SpatialPooler  {

	constructor(opts) {
		this.opts = opts
		this._potentialPools = this._createPotentialPools()
		this._batesFn = d3.randomBates(this.opts.batesIndependentVariables || 10)
		this._batesCenter = this.opts.distributionCenter || 0.5
	}

	getPotentialPools() {
		return this._potentialPools
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

	getPermanences() {
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
}

module.exports = SpatialPooler
