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
 * Takes in text containing slash separated date e.g. 2015/03/01
 * returns first date found as unix time
 * returns null if no date found
 * TODO: adjust for timezones
 */
function getDate(text, context) {
	const WORKOUT_HEADER_DATE_REGEXP = /(\d+\/\d+\/\d+)\s/;
	var dateString = getProp(text.match(WORKOUT_HEADER_DATE_REGEXP), [1]);
	if (!dateString) {
		return null;
	} else {
		dateString.replace(/\//g, '-');
		return Date.parse(dateString);
	}
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
	constructor(header, exercises, meta) {
		this._header = header;
		this._exercises = exercises;
		this._meta = meta;
	}

	isValid() { return this._header.isValid(); }

	static validate(workoutText) { return Workout.parse(workoutText); }

	render() {
		return '<div class="workout">' +
			this._header.render() +
			toHtml(this._exercises.map(exercise => exercise.render())) +
		'</div>';
	}

}

class WorkoutHeader {
	constructor(headerText) {
		var txt = headerText;
		this._text = txt;

		this._workoutDate = getDate(txt);

		this._workoutUnitOfWeight = getUnitOfWeight(txt);

		this._meta = WorkoutHeader.getMeta(txt);
	}

	isValid() {
		return !!this._workoutDate;
	}

	render() {
		return '<div class="workout-header">' +
			toHtml(this._text) +
		'</div>';
	}

	static getMeta(text) {
		return getProp(text.match(/\(([^\)]*)\)/), [1]);
	}
}

class ExerciseSetCollection {
	/**
	 * @param {String} name of exercise from enum of EXERCISES
	 * @param {Array<ExerciseSet>} exerciseSetArray
	 * @parm {ExerciseMeta}
	 */
	constructor(name, exerciseSetArray, exerciseMeta) {
		this._name = name;
		this._sets = exerciseSetArray;
		this._exerciseMeta = exerciseMeta;
	}

	render() {
		return this._name + '\t' +
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

	render() { return this.toString(); }
	isValid() { return true; }

	static toString(sets, reps) {
		return sets + cfg.setsByRepsDelim + reps;
	}

	toString() {
		return ExerciseSet.toString(this._sets, this._reps);
	}

	toShortString() {
		return ExerciseSet.toShortString(this._sets, this._reps);
	}

	static toShortString(sets, reps) {
		if (sets === 1) {
			return reps;
		} else {
			return sets + cfg.setsByRepsDelim + reps;
		}
	}
}

class Workset extends ExerciseSet {
	constructor(sets, reps, weight, comments) {
		this._sets = sets;
		this._reps = reps;
		this._weight = weight;
		this._comments = new ExerciseMeta(comments);
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
