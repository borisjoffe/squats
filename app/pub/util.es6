// 0 is off, 1 is err, 2 is warn, 3 is log, 4 is debug, 5 is trace
var DEBUG = 4;

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

function trace(...args) {
	if (DEBUG >= 5)
		console.log(...args);
	return args.length === 1 ? args[0] : args;
}

function dbg(...args) {
	if (DEBUG >= 4)
		console.log(...args);
	return args.length === 1 ? args[0] : args;
}

function log(...args) {
	if (DEBUG >= 3)
		console.log(...args);
	return args.length === 1 ? args[0] : args;
}

function warn(...args) {
	if (DEBUG >= 2)
		console.warn(...args);
	//debugger;
	return args.length === 1 ? args[0] : args;
}

function err(ErrorType, ...args) {
	if (!ErrorType) {
		if (DEBUG >= 1)
			console.error(...args);
	} else {
		// treat first arg as part of the error message (assume ErrorType is Error)
		if (typeof ErrorType !== 'function') {
			ErrorType = Error;
			var otherArgs = args;
			args = [arguments[0]];
			if (otherArgs.length) args.push(...otherArgs);
		}

		if (DEBUG >= 1) {
			writeError(ErrorType.name + ':', args.join(' '));
			throw new ErrorType(args.join(' '));
		}
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
 * @param {String} dateStr
 * @returns {Date}
 */
function dateFromStr(dateStr) {
	if (typeof dateStr !== 'string')
		err(TypeError, '(dateFromStr) dateStr must be string but was', dateStr);
	var [year, month, day] = dateStr.split('-');
	month = month - 1; // js months start with 0
	return new Date(year, month, day);
}

/**
 * @param {Date} dateObj
 * @returns {String}
 */
function strFromDate(dateObj) {
	if (!(dateObj instanceof Date))
		err(TypeError, '(strFromDate) dateObj must be object but was', dateObj);
	return dateObj.toISOString().split('T')[0];
}

/**
 * @param {String|Number} dayOfWeek - e.g. mon/Monday/monday if string or 1 if number
 * @param {Date} currentDate - (optional) defaults to today
 * @return {Date} date of next occurrence of day of week based on local time
 */
function getDateOfNextDayOfWeek(dayOfWeek, currentDate) {
	var date = currentDate || new Date(),
	    todayIdx = date.getUTCDay(),
	    dayIdx;

	if (typeof dayOfWeek === 'string')
		// get desired value of Date#getDay (0 is Sunday)
		dayIdx = DAYS_KEYS.indexOf(dayOfWeek.toLowerCase().substring(0, 3));
	if (dayIdx < 0 || dayIdx > 6) err('dayIdx is not valid. dayOfWeek supplied was:', dayOfWeek)

	if (todayIdx < dayIdx) date.setUTCDate(date.getUTCDate() + dayIdx - todayIdx);
	if (todayIdx > dayIdx) date.setUTCDate(date.getUTCDate() + dayIdx - todayIdx + 7);

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
		var [year, month, day] = dateString.split('/');
		return new Date(year, month - 1, day); // UTC Time, JS has zero based months
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
        DOM utils
   ==================== */
var $msgField = $("#message-container");
if (!$msgField.length)
	throw new Error("message-container does not exist");

/**
 * @param {String} msgType - "error", "warn", "log"
 * @param {Anything} ...args
 */
function write(msgType, ...args) {
	requestAnimationFrame(() =>
		$msgField.prepend(
			'<div class="message ' + msgType.toString().toLowerCase() + '">' +
				args.join(' ') +
			'</div>'
		)
	);
}

var writeError = _.partial(write, 'error');



/* ====================
     Workout utils
   ==================== */

/**
 * Round num to nearestNum
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



/* ====================
      Render utils
   ==================== */

/**
 * @param {String|HtmlNode} htmlNode - node or an id string
 * @param {React.Component} component
 * @param {JSON} [props=null]
 */
var render = _.curry(function (htmlNode, component, props) {
	if (!props) props = null
	log('rendering', component.name, 'to', htmlNode, 'with props:', props);
	if (typeof htmlNode === 'string')
		htmlNode = document.getElementById(htmlNode);
	React.render(React.createElement(component, props), htmlNode);
});
