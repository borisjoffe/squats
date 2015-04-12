var DEBUG = 1;

/* ====================
         Shims
   ==================== */
if (!String.prototype.contains) {
	String.prototype.contains = function (text) {
		return this.indexOf(text) !== -1;
	};
}

// replace with lodash method
_.sum = function (collection) {
	return collection.reduce((sum, num) => sum + num, 0);
};

/* ====================
     General utils
   ==================== */
function log(...args) {
	console.log(...args);
	return args.length === 1 ? args[0] : args;
}

function warn(...args) {
	console.warn(...args);
	//debugger;
	return args.length === 1 ? args[0] : args;
}

function err(ErrorType, ...args) {
	if (!ErrorType) {
		console.error(...args);
	} else {
		// treat first arg as part of the error message (assume ErrorType is Error)
		if (typeof ErrorType !== 'object') {
			ErrorType = Error;
			var otherArgs = args;
			args = [arguments[0]];
			if (otherArgs.length) args.push(...otherArgs);
		}

		throw new ErrorType(args.join(' '));
	}
	return args.length === 1 ? args[0] : args;
}

/* ====================
     Date utils
   ==================== */

// TODO: il8n - some locales start with monday
var DAYS = {
	SUN: "sun",
	MON: "mon",
	TUE: "tue",
	WED: "wed",
	THU: "thu",
	FRI: "fri",
	SAT: "sat"
};

var daysValues = _.values(DAYS);

/**
 * @param {String|Number} dayOfWeek - e.g. mon/Monday/monday if string or 1 if number
 * @return {Date} date of next occurrence of day of week based on local time
 */
function getDateOfNextDayOfWeek(dayOfWeek) {
	var date = new Date(),
	    todayIdx = date.getDay(),
	    dayIdx;

	if (typeof dayOfWeek === 'string')
		// get desired value of Date#getDay (0 is Sunday)
		dayIdx = daysValues.indexOf(dayOfWeek.toLowerCase().substring(0, 3));
	if (dayIdx < 0 || dayIdx > 6) err('dayIdx is not valid. dayOfWeek supplied was:', dayOfWeek)

	if (todayIdx < dayIdx) date.setDate(date.getDate() + dayIdx - todayIdx);
	if (todayIdx > dayIdx) date.setDate(date.getDate() + dayIdx - todayIdx + 7);

	return date;
}


/**
 * @param {String} text containing slash separated date e.g. 2015/03/01
 * @return {Date|null} first date found or null if no date found
 * TODO: adjust for timezones
 */
function getDate(text) {
	const WORKOUT_HEADER_DATE_REGEXP = /(\d+\/\d+\/\d+)\s/;
	var dateString = getProp(text.match(WORKOUT_HEADER_DATE_REGEXP), [1]);
	if (!dateString) {
		return null;
	} else {
		dateString.replace(/\//g, '-');
		return new Date(Date.parse(dateString));
	}
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

const lowestPlate = _.last(cfg.plates);
var round = _.curry(roundTo)(lowestPlate * 2);
