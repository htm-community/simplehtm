
class SpatialPooler  {

	constructor(opts) {
		this.opts = opts
		this._potentialPools = this._createPotentialPools()
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
				perms.push(Math.random())
			})
			allPerms.push(perms)
		})
		return allPerms
	}
}

module.exports = SpatialPooler
