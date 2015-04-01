var DEBUG = 1;

/* ====================
         Shims
   ==================== */
if (!String.prototype.contains) {
	String.prototype.contains = function (text) {
		return this.indexOf(text) !== -1;
	};
};

/* ====================
     General utils
   ==================== */
function log() {
	console.log(...arguments);
	return arguments.length === 1 ? arguments[0] : _.toArray(arguments);
}

function warn() {
	debugger;
	console.warn(...arguments);
	return arguments.length === 1 ? arguments[0] : _.toArray(arguments);
}

// Build an index on an array based on an object property.
// Assumes that arr contains objects that have unique keys
// Updates to objects that don't modify the key will NOT invalidate the index
// Adding / removing elements to the array or changing keys after building the index will NOT be reflected
function buildIndex(arr, prop) {
	return _.pluck(arr, prop)
		.reduce(function (indexObject, currentKey, currentIndex) {
			indexObject[currentKey] = arr[currentIndex];
			return indexObject;
		}}, {});
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
