let d3 = require('d3')

class SpatialPooler {

  constructor(opts) {
    this.opts = opts
    this._batesFn = d3.randomBates(this.opts.batesIndependentVariables || 10)
    this._batesCenter = this.opts.distributionCenter || 0.5
    this._potentialPools = this._createPotentialPools()
    this._permanences = this._createPermanences()
  }

  getPotentialPools() {
    return this._potentialPools
  }

  getPermanences() {
    return this._permanences
  }

  compete(input) {
    const overlaps = []
    for (let mcIndex = 0; mcIndex < this.opts.size; mcIndex++) {
      overlaps.push({
        index: mcIndex,
        overlap: this.calculateOverlap(mcIndex, input)
      })
    }
    // Sort by overlap score
    overlaps.sort((a, b) => {
      if (a.overlap.length < b.overlap.length) return -1
      if (a.overlap.length > b.overlap.length) return 1
      return 0
    })

    return overlaps.slice(overlaps.length - this.opts.winnerCount)
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

}

module.exports = SpatialPooler
