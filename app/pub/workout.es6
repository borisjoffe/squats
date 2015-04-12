const WORKOUT_SEPARATOR = '\n\n';
const WHITESPACE = /\s/;
var cfg = window.cfg;

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

var getExerciseName = _.identity;

class Workouts {
	// input can have meta sections
	constructor(workoutsArray) {
		this._sections = workoutsArray;
	}

	getAll() {
		return this._sections.slice();
	}
}

class MetaSection {
	constructor(sectionText) {
		this._meta = sectionText;
	}

	render() {
		return '<div class="meta-section">' +
			toHtml(this._meta) +
		'</div>';
	}
}

class Workout {
	/**
	 * @param {WorkoutHeader} header
	 * @param {Array<ExerciseSetCollection>} exerciseSets
	 * @param {ExerciseMeta} meta
	 */
	constructor(header, exerciseSets, meta) {
		this._header = header;
		this._exerciseSets = exerciseSets;
		this._meta = meta;
	}

	getHeader() { return this._header; }
	getExerciseSets() { return this._exerciseSets; }

	isValid() { return this._header.isValid(); }

	static validate(workoutText) { return Workout.parse(workoutText); }

	render() {
		return '<div class="workout">' +
			this._header.render() +
			toHtml(this._exerciseSets.map(exercise => exercise.render())) +
		'</div>';
	}

}

class WorkoutHeader {
	constructor(date, unitOfWeight, meta) {
		this._workoutDate = date;
		this._unitOfWeight = unitOfWeight;
		this._meta = meta;
	}

	isValid() {
		return !!this._workoutDate;
	}

	toString() { return this._text; }

	render() {
		return '<div class="workout-header">' +
			toHtml(this.toString()) +
		'</div>';
	}

	static getMeta(text) {
		return getProp(text.match(/\(([^\)]*)\)/), [1]);
	}
}

/**
 * @param {Number} min
 * @param {Number} max
 * @param {Number} numValues
 * @return {Array<Number>} array of numValues values from min to max, including min but not max
 */
function getValuesBetween(min, max, numValues) {
	if (_.reject(arguments, isFinite) > 0)
		err(TypeError, '(getValuesBetween) min, max, and num must be finite but were:', arguments);
	if (max <= min)
		err(RangeError, '(getValuesBetween) max must be strictly greater than min. max:', max, '| min:', min);
	return _.range(min, max, (max - min) / numValues);
}

function makeValueBetween(value, min, max) {
	return Math.min(max, Math.max(value, min));
}

/**
 * If the input is an array, return it. Otherwise return an array containing only the input
 */
function makeArray(valueOrArray) {
	return Array.isArray(valueOrArray) ? valueOrArray : [valueOrArray];
}

/**
 * @param {Workset|Array<Workset>} worksets
 * @param {JSON} warmupSchema
 * @return {Array<ExerciseSet>} warmup sets
 */
function getWarmupsForWorksets(worksets, warmupSchema) {
	worksets = makeArray(worksets);
	var
		warmup = warmupSchema,
		totalWorksets = _.sum(_.invoke(worksets, 'getSets')),

		numWarmups = makeValueBetween(warmup.desiredTotalSets - totalWorksets, warmup.min, warmup.max),
		lowestWorksetWeight = _.min(_.invoke(worksets, 'getWeight')),
		firstWarmupWeight = warmup.firstWarmupPct * lowestWorksetWeight,

		warmups = getValuesBetween(firstWarmupWeight, lowestWorksetWeight, numWarmups)
		          // current behavior with desiredTotalSets and warmup.sets assumes that each warmup is one set
		          .map(weight => new ExerciseSet(warmup.sets, warmup.reps, round(weight)));

	return warmups;
}

class ExerciseSetCollection {
	/**
	 * @param {String} name of exercise from enum of EXERCISES
	 * @param {Array<ExerciseSet>} exerciseSetArray
	 * @parm {ExerciseMeta} exerciseMeta
	 */
	constructor(name, exerciseSetArray, exerciseMeta) {
		this._name = name;
		this._sets = makeArray(exerciseSetArray);
		this._exerciseMeta = exerciseMeta;
	}
	getName() { return this._name; }
	getSets() { return this._sets; }
	getMeta() { return this._exerciseMeta; }

	render() {
		return this._name + ' ' +
		       _.invoke(this._sets, 'render').join(', ') + ' ' +
		      this._exerciseMeta.render();
	}
}

class ExerciseMeta {
	constructor (metaText) {
		this._text = metaText ? metaText : '';
	}

	toString() { return this._text; }
	render() { return this._text; }
}

class ExerciseSet {
	constructor(sets, reps, weight, comments) {
		[this._sets, this._reps, this._weight, this._comments] = arguments;
	}
	getSets() { return this._sets; }
	getReps() { return this._reps; }
	getWeight() { return this._weight; }
	getComments() { return this._comments; }
	isWorkset() { return this._isWorkset; }
	setExercise(exerciseName) { this._ex = exerciseName; }

	render() { return this.toString(); }
	isValid() { return true; }

	static toString(sets, reps, weight, exerciseName) {
		return (exerciseName ? exerciseName + ' ' : '') +
		    sets + cfg.setsByRepsDelim + reps +
		    (weight ? cfg.weightDelim + weight : '');
	}

	toString() {
		return ExerciseSet.toString(this._sets, this._reps, this._weight, this._ex);
	}

	toShortString() {
		return ExerciseSet.toShortString(this._sets, this._reps, this._weight, this._ex);
	}

	static toShortString(sets, reps, weight) {
		if (sets === 1) {
			return reps + (weight ? cfg.weightDelim + weight : '');
		} else {
			return ExerciseSet.toString(sets, reps, weight);
		}
	}
}

class Workset extends ExerciseSet {
	constructor(sets, reps, weight, comments) {
		this._sets = sets;
		this._reps = reps;
		this._weight = weight;
		this._comments = new ExerciseMeta(comments);
		this._isWorkset = true;
	}

	setWeight(weight) {
		this._weight = weight;
	}

	render() { return this.toString() + ':' + this._weight; }
}

window.WorkoutsView = class WorkoutsView {
	constructor(workouts) {
		if (!(workouts instanceof Workouts)) {
			workouts = parseWorkouts(workouts);
		}

		var html = [];

		workouts.getAll().forEach(function (section) {
			html.push(section.render());
		});

		this._html = html.join('');
	}

	render() { return this._html; }
};

_.each([Workout, ExerciseSet, WorkoutHeader, ExerciseSetCollection, ExerciseMeta],
	o => { o.tryCreate = createMixin; });


//export {Workouts, WorkoutsView};
