var DEBUG = 1;

/* ====================
         Shims
   ==================== */
if (!String.prototype.contains) {
	String.prototype.contains = function (text) {
		return this.indexOf(text) !== -1;
	};
}

/* ====================
     General utils
   ==================== */
function log(...args) {
	console.log(...args);
	return args.length === 1 ? args[0] : args;
}

function warn(...args) {
	console.warn(...args);
	debugger;
	return args.length === 1 ? args[0] : args;
}

function err(ErrorType, ...args) {
	if (!ErrorType) {
		console.error(...args);
	} else {
		// treat first arg as part of the error message (assume ErrorType is Error)
		if (typeof ErrorType === 'string') {
			ErrorType = Error;
			args = [ErrorType].push(...args);
		}

		throw new ErrorType(args.join(' '));
	}
	return args.length === 1 ? args[0] : args;
}

// Build an index on an array based on an object property.
// Assumes that arr contains objects that have unique keys
// Updates to objects that don't modify the key will NOT invalidate the index
// Adding / removing elements to the array or changing keys after building the index will NOT be reflected
function buildIndexHash(arr, prop) {
	return _.pluck(arr, prop)
		.reduce(function (indexObject, currentKey, currentIndex) {
			indexObject[currentKey] = arr[currentIndex];
			return indexObject;
		}, {});
}

// Mixin for object creation that validates args supplied
// Requires validate function to be present
var createMixin = function () {
	if (!(this instanceof Object)) { err(TypeError, 'Cannot call create on non-objects'); }
	if (typeof this.validate !== 'function') {
		err(TypeError, '(createMixin) validate is required on `this` (this.name =', this.name + ')');
	}

	if (this.validate(...arguments)) {
		return new this(...arguments);
	} else {
		return false;
	}
};


/* ====================
      Workout utils
   ==================== */

/**
 * Round num to nearestY
 * @param {Number} nearestNum
 * @param {Number} num
 * @return {Number}
 */
function roundTo(nearestNum, num) {
	return Math.round(num / nearestNum) * nearestNum;
}

const lowestPlate = 2.5; // TODO: get from cfg
var round = _.curry(roundTo)(lowestPlate * 2);
