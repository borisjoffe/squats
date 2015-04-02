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
function log() {
	console.log(...arguments);
	return arguments.length === 1 ? arguments[0] : _.toArray(arguments);
}

function warn() {
	console.warn(...arguments);
	debugger;
	return arguments.length === 1 ? arguments[0] : _.toArray(arguments);
}

function err(ErrorType, ...args) {
	if (!ErrorType) {
		console.error(...args);
	} else {
		throw new ErrorType(args.join(' '));
	}
	return args.length === 1 ? args[0] : _.toArray(args);
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
