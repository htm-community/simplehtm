let d3 = require('d3')

class SpatialPooler  {

	constructor(opts) {
		this.opts = opts
		this._potentialPools = this._createPotentialPools()
		this._batesFn = d3.randomBates(this.opts.batesIndependentVariables || 1)
		this._batesCenter = this.opts.batesCenter || 0.5
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

/*
		const batesFn = d3.randomBates(this.props.connectionDistribution)
		const center = this.props.distributionCenter
    this.minicolumns = [...Array(this.props.minicolumnCount)].map(_ => 
      [...Array(this.props.inputSpaceSize)].map(_ => 
        p(this.props.connectedPercent) ?  batesFn() + center - 0.5 : undefined, this), this)

*/

	getPermanences() {
		const pools = this.getPotentialPools()
		const allPerms = []
		pools.forEach(pool => {
			const perms = []
			pool.forEach(_ => {
				perms.push(this._batesFn())
			})
			allPerms.push(perms)
		})
		return allPerms
	}
}

module.exports = SpatialPooler
