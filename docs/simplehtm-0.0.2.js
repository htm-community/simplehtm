/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/encoders/rdse.js":
/*!******************************!*\
  !*** ./src/encoders/rdse.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let INITIAL_BUCKETS = 1000;\n\n/*\n Translated from https://github.com/rhyolight/nupic/blob/17a2320b7e23f28de63522fb3c41af639c499639/src/nupic/encoders/random_distributed_scalar.py\n */\nclass RDSE {\n\n    constructor(resolution, n, w) {\n        this.resolution = resolution;\n        this.n = n;\n        this.w = w;\n        this._maxOverlap = 2;\n        this.minIndex = undefined;\n        this.maxIndex = undefined;\n        this._offset = undefined;\n        this._initializeBucketMap(INITIAL_BUCKETS, this._offset);\n    }\n\n    _initializeBucketMap(maxBuckets, offset) {\n        var me = this;\n        this._maxBuckets = maxBuckets;\n        this.minIndex = this._maxBuckets / 2;\n        this.maxIndex = this._maxBuckets / 2;\n        this._offset = offset;\n        this.bucketMap = {};\n\n        this.bucketMap[this.minIndex] = function (n) {\n            var i = 0;\n            var r = [];\n            for (; i < me.n; i++) {\n                r.push(i);\n            }\n            return _.shuffle(r);\n        }().splice(0, this.w);\n\n        this.numTries = 0;\n    }\n\n    _countOverlapIndices(i, j) {\n        //Return the overlap between bucket indices i and j\n        if (this.bucketMap[i] !== undefined && this.bucketMap[j] !== undefined) {\n            return this._countOverlap(this.bucketMap[i], this.bucketMap[j]);\n        } else {\n            throw Error(\"Either i or j don't exist\");\n        }\n    }\n\n    _overlapOK(i, j, opts) {\n        //Return True if the given overlap between bucket indices i and j are\n        //acceptable. If overlap is not specified, calculate it from the bucketMap\n        var overlap = opts.overlap;\n        if (overlap == undefined) {\n            overlap = this._countOverlapIndices(i, j);\n        }\n        if (Math.abs(i - j) < this.w) {\n            return overlap == this.w - Math.abs(i - j);\n        } else {\n            return overlap <= this._maxOverlap;\n        }\n    }\n\n    getBucketIndices(x) {\n        var bucketIdx;\n\n        if (this._offset == undefined) {\n            this._offset = x;\n        }\n\n        bucketIdx = this._maxBuckets / 2 + parseInt(Math.round((x - this._offset) / this.resolution));\n\n        console.log('value: %s, bucket: %s', x, bucketIdx);\n\n        if (bucketIdx < 0) {\n            console.log('reached min buckets');\n            bucketIdx = 0;\n        } else if (bucketIdx >= this._maxBuckets) {\n            console.log('reached max buckets');\n            bucketIdx = this._maxBuckets - 1;\n        }\n        return [bucketIdx];\n    }\n\n    _countOverlap(rep1, rep2) {\n        return SDR.tools.getOverlapScore(rep1, rep2);\n    }\n\n    _newRepresentationOK(newRep, newIndex) {\n        var newRepBinary = [];\n        var midIdx = this._maxBuckets / 2;\n        var runningOverlap;\n        var me = this;\n        var returnFalse = false;\n\n        //Return True if this new candidate representation satisfies all our overlap\n        //rules. Since we know that neighboring representations differ by at most\n        //one bit, we compute running overlaps.\n        if (newRep.length != this.w) {\n            return false;\n        }\n        if (newIndex < this.minIndex - 1 || newIndex > this.maxIndex + 1) {\n            throw Error('newIndex must be within one of existing indices');\n        }\n\n        // A binary representation of newRep. We will use this to test containment\n        _.times(this.n, function () {\n            newRepBinary.push(false);\n        });\n        newRepBinary[newRep] = true;\n        // Start by checking the overlap at minIndex\n        runningOverlap = this._countOverlap(this.bucketMap[this.minIndex], newRep);\n        if (!this._overlapOK(this.minIndex, newIndex, { overlap: runningOverlap })) {\n            return false;\n        }\n\n        // Compute running overlaps all the way to the midpoint\n        _.each(_.range(this.minIndex + 1, midIdx + 1), function (i) {\n            // This is the bit that is going to change\n            var newBit = (i - 1) % me.w;\n            // Update our running overlap\n            if (newRepBinary[me.bucketMap[i - 1][newBit]]) {\n                runningOverlap--;\n            }\n            if (newRepBinary[me.bucketMap[i][newBit]]) {\n                runningOverlap++;\n            }\n            // Verify our rules\n            if (!me._overlapOK(i, newIndex, { overlap: runningOverlap })) {\n                returnFalse = true;\n            }\n        });\n        if (returnFalse) return false;\n\n        // At this point, runningOverlap contains the overlap for midIdx\n        // Compute running overlaps all the way to maxIndex\n        _.each(_.range(midIdx + 1, this.maxIndex + 1), function (i) {\n            // This is the bit that is going to change\n            var newBit = i % me.w;\n            // Update our running overlap\n            if (newRepBinary[me.bucketMap[i - 1][newBit]]) {\n                runningOverlap--;\n            }\n            if (newRepBinary[me.bucketMap[i][newBit]]) {\n                runningOverlap++;\n            }\n            // Verify our rules\n            if (!me._overlapOK(i, newIndex, { overlap: runningOverlap })) {\n                returnFalse = true;\n            }\n        });\n        return !returnFalse;\n    }\n\n    _newRepresentation(index, newIndex) {\n        var newRepresentation = this.bucketMap[index].slice();\n        var ri = newIndex % this.w;\n        var newBit = _.random(this.n);\n        newRepresentation[ri] = newBit;\n        while (this.bucketMap[index].indexOf(newBit) > -1 || this._newRepresentationOK(newRepresentation, newIndex)) {\n            this.numTries++;\n            newBit = _.random(this.n);\n            newRepresentation[ri] = newBit;\n        }\n        return newRepresentation;\n    }\n\n    _createBucket(index) {\n        //Create the given bucket index. Recursively create as many in-between\n        //bucket indices as necessary.\n        if (index < this.minIndex) {\n            if (index == this.minIndex - 1) {\n                // Create a new representation that has exactly w-1 overlapping bits\n                // as the min representation\n                this.bucketMap[index] = this._newRepresentation(this.minIndex, index);\n                this.minIndex = index;\n            } else {\n                // Recursively create all the indices above and then this index\n                this._createBucket(index + 1);\n                this._createBucket(index);\n            }\n        } else {\n            if (index == this.maxIndex + 1) {\n                // Create a new representation that has exactly w-1 overlapping bits\n                // as the max representation\n                this.bucketMap[index] = this._newRepresentation(this.maxIndex, index);\n                this.maxIndex = index;\n            } else {\n                // Recursively create all the indices below and then this index\n                this._createBucket(index - 1);\n                this._createBucket(index);\n            }\n        }\n    }\n\n    mapBucketIndexToNonZeroBits(index) {\n        if (index < 0) {\n            index = 0;\n        }\n\n        if (index >= this._maxBuckets) {\n            index = this._maxBuckets - 1;\n        }\n\n        if (_.keys(this.bucketMap).indexOf(index.toString()) == -1) {\n            this._createBucket(index);\n        }\n        return this.bucketMap[index];\n    }\n\n    encode(x) {\n        //# Get the bucket index to use\n        var bucketIdx = this.getBucketIndices(x)[0];\n        var output = [];\n\n        //# None is returned for missing value in which case we return all 0's.\n        _.times(this.n, function () {\n            output.push(0);\n        });\n\n        if (bucketIdx !== undefined) {\n            _.each(this.mapBucketIndexToNonZeroBits(bucketIdx), function (i) {\n                output[i] = 1;\n            });\n        }\n        return output;\n    }\n}\n\nmodule.exports = RDSE;\n\n//# sourceURL=webpack:///./src/encoders/rdse.js?");

/***/ }),

/***/ "./src/encoders/relativeScalar.js":
/*!****************************************!*\
  !*** ./src/encoders/relativeScalar.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function encode(value, n, resolution, min, max) {\n    let bitIndexToValue = d3.scaleLinear().domain([0, n]).range([min, max]);\n    let encoding = [];\n    // For each bit in the encoding.\n    for (let i = 0; i < n; i++) {\n        let bitScalarValue = bitIndexToValue(i),\n            bitValue = 0,\n            valueDiff = bitScalarValue - value,\n            valueDistance = Math.abs(valueDiff),\n            radius = resolution / 2;\n        if (valueDistance <= radius) bitValue = 1;\n        encoding.push(bitValue);\n    }\n    return encoding;\n}\n\nfunction encodeBounded(value, n, resolution, min, max) {\n    let bitIndexToValue = d3.scaleLinear().domain([0, n]).range([min, max]);\n    let encoding = [];\n    // For each bit in the encoding.\n    for (let i = 0; i < n; i++) {\n        let bitValue = bitIndexToValue(i),\n            bit = 0,\n            valueDiff = bitValue - value,\n            valueDistance = Math.abs(valueDiff),\n            radius = resolution / 2;\n        if (valueDistance <= radius) bit = 1;\n        // Keeps the bucket from changing size at min/max values\n        if (value < min + radius && bitValue < min + resolution) bit = 1;\n        if (value > max - radius && bitValue > max - resolution) bit = 1;\n        encoding.push(bit);\n    }\n    return encoding;\n}\n\nclass RelativeScalarEncoder {\n\n    constructor(n, resolution, min, max, bounded = false) {\n        this.n = n;\n        this.resolution = resolution;\n        this.min = min;\n        this.max = max;\n        this.range = max - min;\n        this.bounded = bounded;\n        this._bitIndexToValue = d3.scaleLinear().domain([0, n]).range([min, max]);\n    }\n\n    encode(value) {\n        if (this.bounded) {\n            return encodeBounded(value, this.n, this.resolution, this.min, this.max);\n        }\n        return encode(value, this.n, this.resolution, this.min, this.max);\n    }\n\n    getRangeFromBitIndex(i) {\n        let v = this._bitIndexToValue(i),\n            res = this.resolution,\n            min = this.min,\n            max = this.max,\n            radius = res / 2,\n            left = Math.max(this.min, v - radius),\n            right = Math.min(this.max, v + radius);\n        // Keeps the bucket from changing size at min/max values\n        if (this.bounded) {\n            if (left < min + radius) left = min;\n            if (right > max - radius) right = max;\n        }\n        return [left, right];\n    }\n}\n\nmodule.exports = RelativeScalarEncoder;\n\n//# sourceURL=webpack:///./src/encoders/relativeScalar.js?");

/***/ }),

/***/ "./src/encoders/scalar.js":
/*!********************************!*\
  !*** ./src/encoders/scalar.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class ScalarEncoder {\n\n    constructor(n, w, min, max) {\n        this.n = n;\n        this.resolution = w;\n        this.numBuckets = n - w + 1;\n        this.range = max - min;\n        this.min = min;\n        this.max = max;\n        this._valueToBitIndex = d3.scaleLinear().domain([0, this.n]).range([min, max]);\n        this.sparsity = w / n;\n    }\n\n    encode(input) {\n        let output = [];\n        let firstBit;\n        let min = this.min;\n        firstBit = Math.floor(this.numBuckets * (input - min) / this.range);\n        for (let i = 0; i < this.n; i++) {\n            output.push(0);\n        }\n        for (let i = 0; i < this.resolution; i++) {\n            if (firstBit + i < output.length) output[firstBit + i] = 1;\n        }\n        return output;\n    }\n\n    getRangeFromBitIndex(i) {\n        let value = this._valueToBitIndex(i);\n        let start = value - this.max * this.sparsity / 2;\n        let end = value + this.max * this.sparsity / 2;\n        let out = [];\n        out.push(start);\n        out.push(end);\n        return out;\n    }\n}\n\nfunction PeriodicScalarEncoder(n, w, radius, minValue, maxValue) {\n    let neededBuckets;\n    // Distribute nBuckets points along the domain [minValue, maxValue],\n    // including the endpoints. The resolution is the width of each band\n    // between the points.\n\n    if (!n && !radius || n && radius) {\n        throw new Error('Exactly one of n / radius must be defined.');\n    }\n\n    this.resolution = w;\n    this.radius = radius;\n    this.minValue = minValue;\n    this.maxValue = maxValue;\n\n    this.range = maxValue - minValue;\n\n    if (n) {\n        this.n = n;\n        this.radius = this.resolution * (this.range / this.n);\n        this.bucketWidth = this.range / this.n;\n    } else {\n        this.bucketWidth = this.radius / this.resolution;\n        neededBuckets = Math.ceil(this.range / this.bucketWidth);\n        if (neededBuckets > this.resolution) {\n            this.n = neededBuckets;\n        } else {\n            this.n = this.resolution + 1;\n        }\n    }\n}\n\nPeriodicScalarEncoder.prototype.getWidth = function () {\n    return this.n;\n};\n\nPeriodicScalarEncoder.prototype.encode = function (input) {\n    let output = [];\n    let i, index;\n    let iBucket = Math.floor((input - this.minValue) / this.bucketWidth);\n    let middleBit = iBucket;\n    let reach = (this.resolution - 1) / 2.0;\n    let left = Math.floor(reach);\n    let right = Math.ceil(reach);\n\n    if (input < this.minValue || input >= this.maxValue) {\n        throw Error('Input out of bounds: ' + input);\n    }\n\n    for (let i = 0; i < this.n; i++) {\n        output.push(0);\n    }\n\n    output[middleBit] = 1;\n\n    for (i = 1; i <= left; i++) {\n        index = middleBit - 1;\n        if (index < 0) {\n            index = index + this.n;\n        }\n        if (index > this.n) {\n            throw Error('out of bounds');\n        }\n        output[index] = 1;\n    }\n    for (i = 1; i <= right; i++) {\n        if ((middleBit + i) % this.n > this.n) {\n            throw Error('out of bounds');\n        }\n        output[(middleBit + i) % this.n] = 1;\n    }\n    return output;\n};\n\nmodule.exports = {\n    ScalarEncoder: ScalarEncoder,\n    PeriodicScalarEncoder: PeriodicScalarEncoder\n};\n\n//# sourceURL=webpack:///./src/encoders/scalar.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("let scalars = __webpack_require__(/*! ./encoders/scalar */ \"./src/encoders/scalar.js\");\n\n// Packages up the entire thing in namespaces.\nwindow.simplehtm = {\n\n    encoders: {\n        ScalarEncoder: scalars.ScalarEncoder,\n        PeriodicScalarEncoder: scalars.PeriodicScalarEncoder,\n        RelativeScalarEncoder: __webpack_require__(/*! ./encoders/relativeScalar */ \"./src/encoders/relativeScalar.js\"),\n        RDSE: __webpack_require__(/*! ./encoders/rdse */ \"./src/encoders/rdse.js\")\n    }\n\n};\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/index.js */\"./src/index.js\");\n\n\n//# sourceURL=webpack:///multi_./src/index.js?");

/***/ })

/******/ });