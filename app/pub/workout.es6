const WORKOUT_SEPARATOR = '\n\n';
const WHITESPACE = '\s';
var cfg = window.cfg;

function toHtml(text) {
	return Array.isArray(text) ?
		text.join('<br>') :
		text.replace(/\n/g, '<br>');
}

function chop(text, textToChop) {
	return typeof text !== 'string' ?
		text :
		text.replace(textToChop, '');
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

/*
 * TODO: partition text / comments somehow
 */
function splitComments(text) { return [text]; }

class Workouts {
	constructor(text) {
		this._chunks = text.split(WORKOUT_SEPARATOR);
		this._sections = this._chunks.reduce(function (sections, section, idx) {
			var w, m;
			// TODO: add workout validator static method
			// TODO: abstract this logic out to allow for more types of content
			w = new Workout(section);
			if (w.isValid()) {
				sections.push(w);
			} else {
				m = new MetaSection(section);
				sections.push(m);
			}

			return sections;
		}, []);
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
		if (arguments.length === 0) { this.parse(arguments[0]); }
		else {
			this._header = new WorkoutHeader(header);
			this._exercises = new ExerciseSetCollection(exercises);
			this._meta = meta;
		}
	}

	parse(workoutText) {
		const EXERCISE_SEPARATOR = '\n';
		this._chunks = workoutText.split(EXERCISE_SEPARATOR);
		this._header = new WorkoutHeader(this._chunks[0]);
		this._exercises = [];
		this._chunks.slice(1).forEach(exerciseText =>
			this._exercises.push(new ExerciseSetCollection(exerciseText)));
	}

	isValid() { return this._header.isValid(); }

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
	constructor(name, exSetArr, exComment) {
		if (arguments.length === 1) {
			this.parse(arguments[0]);
		} else {
			this._name = name;
			this._exercises = exSetArr.map(exSet => new ExerciseSet(exset));
			this._comments = new ExerciseMeta(exComment);
		}
	}

	parse(exerciseText) {
		var isValid = true;
		// TEXT FORMAT: EXERCISE_NAME COMMA_SEPARATED_SETS OPTIONAL COMMENT
		this._text = exerciseText;
		this._sections = exerciseText.split(WHITESPACE);
		this._name = getExerciseName(this._sections[0]);
		this._exercises = this._sections.slice(1).join(''); // TODO: parse into sets and comments
		this._comments = '';
		return isValid;
	}

	render() { return toHtml(this._text); }

	validate(text) {
		return !!this._name && !!this._exercises;
	}
}

class ExerciseMeta {
	constructor (metaText) {
		this.parse(metaText);
	}

	parse(metaText) {
		this._text = metaText;
		return true;
	}

	toString() { return this._text; }
}

class ExerciseSet {
	constructor(setArray) {
		// TEXT FORMAT: NUM_SETSxREP:WEIGHT
		const SET_SEPARATOR = ',';
		this._chunks = setArray;
	}

	render() { return toHtml(this._chunks); }
	isValid() { return true; }

	toString(sets, reps) {
		if (this instanceof ExerciseSet) {
			sets = this._sets;
			reps = this._reps;
		}

		return sets + cfg.setsByRepsDelim + reps;
	}

	toShortString(sets, reps) {
		if (this instanceof ExerciseSet) {
			sets = this._sets;
			reps = this._reps;
		}

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
}

window.WorkoutsView = class WorkoutsView {
	constructor(workouts) {
		if (!(workouts instanceof Workouts)) {
			workouts = new Workouts(workouts);
		}

		var html = [];

		workouts.getAll().forEach(function (section) {
			html.push(section.render());
		});

		this._html = html.join('');
	}

	render() { return this._html; }
};

//export {Workouts, WorkoutsView};
