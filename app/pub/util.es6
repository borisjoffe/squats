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
