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

/**
 * If the input is an array, return it. Otherwise return an array containing only the input
 */
function makeArray(valueOrArray) {
	return Array.isArray(valueOrArray) ? valueOrArray : [valueOrArray];
}

function toHtml(text) {
	if (Array.isArray(text))
		return text.map(toHtml).join('<br>')
	else if (text !== null && text !== undefined)
		return text.replace(/\n/g, '<br>');
	else
		return '<!-- ' + warn('text is null or undefined:', text) + ' -->';
}

function getProp(obj, path) {
	const PATH_DELIM = '.';
	if (typeof path === 'string') {
		path = path.split(PATH_DELIM);
	}
	var prop = obj;

	while (path.length && obj && obj !== null) {
		prop = obj[path[0]];
		path = path.slice(1);
	}

	return prop;
}

/**
 * Copy certain properties from one object to another or to an array of others (mutates destObj)
 * @param {Object} srcObj
 * @param {Object|Array<Object>} destObj - single object to copy to or an array of objects
 * @param {Array|String} propsArr - array of keys to copy or string of a single key to copy
 * @return {Object} destObj
 */
function copyProps(srcObj, destObj, propsArr) {
	if (Array.isArray(destObj))
		return destObj.map(_.partial(copyProps, srcObj, _, propsArr));
	makeArray(propsArr).forEach(key => { destObj[key] = srcObj[key]; });
	return destObj;
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

var DAYS_KEYS = _.invoke(_.keys(DAYS), 'toLowerCase');

/**
 * @param {String|Number} dayOfWeek - e.g. mon/Monday/monday if string or 1 if number
 * @param {Date} currentDate - (optional) defaults to today
 * @return {Date} date of next occurrence of day of week based on local time
 */
function getDateOfNextDayOfWeek(dayOfWeek, currentDate) {
	var date = currentDate || new Date(),
	    todayIdx = date.getDay(),
	    dayIdx;

	if (typeof dayOfWeek === 'string')
		// get desired value of Date#getDay (0 is Sunday)
		dayIdx = DAYS_KEYS.indexOf(dayOfWeek.toLowerCase().substring(0, 3));
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


/**
 * Takes in text containing unit of weight
 * returns first unit of weight found
 * returns user's default unit of weight if no date found
 */
function getUnitOfWeight(text, context) {
	if (text.contains('lbs') || text.contains('lb'))
		return cfg.unitOfWeight.pounds;
	else if (text.contains('kgs') || text.contains('kg'))
		return cfg.unitOfWeight.kilos;
	else
		return cfg.unitOfWeight.DEFAULT;
}
