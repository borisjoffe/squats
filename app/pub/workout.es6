const WORKOUT_SEPARATOR = '\n\n';
const WHITESPACE = '\s';

function toHtml(text) {
	return (Array.isArray(text)) ?
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

/*
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
	constructor(workoutText) {
		const EXERCISE_SEPARATOR = '\n';
		this._chunks = workoutText.split(EXERCISE_SEPARATOR);
		this._header = new WorkoutHeader(this._chunks[0]);
		this._exercises = [];
		for (var exerciseText in this._chunks.slice(1))
			this._exercises.push(new Exercise(exerciseText));
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

class Exercise {
	constructor(exerciseText) {
		// TEXT FORMAT: EXERCISE_NAME COMMA_SEPARATED_SETS OPTIONAL COMMENT
		this._text = exerciseText;
		this._sections = exerciseText.split(WHITESPACE);
		this._name = getExerciseName(this._sections[0]);
		this._sets = this._sections.slice(1).join(''); // TODO: parse into sets and comments
		this._comments = '';
	}

	render() { return toHtml(this._text); }
	isValid() { return !!this._name && !!this._sets; }
}

class ExerciseSet {
	constructor(setArray) {
		// TEXT FORMAT: NUM_SETSxREP:WEIGHT
		const SET_SEPARATOR = ',';
		this._chunks = setArray;
	}

	render() { return toHtml(this._chunks); }
	isValid() { return true; }
}

class WorkoutsView {
	constructor(workouts) {
		var html = [];

		workouts.getAll().forEach(function (section) {
			html.push(section.render());
		});

		this._html = html.join('');
	}

	render() { return this._html; }
}

export {Workouts, WorkoutsView};
