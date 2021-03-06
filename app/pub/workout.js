import cfg from 'config';
import { err, toHtml, friendlyStrFromDate, createMixin, makeArray, round } from 'util';

export class Workouts {
	// input can have meta sections
	constructor(workoutsArray) {
		this._sections = workoutsArray;
	}

	getAll() {
		return this._sections.slice();
	}
}

export class MetaSection {
	constructor(sectionText) {
		this._meta = sectionText;
	}

	toString() { return this._meta; }
}

export class Workout {
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

export class WorkoutHeader {
	constructor(date, unitOfWeight, meta) {
		this._workoutDate = date instanceof Date ?
		    new Date(date) : // clone date to avoid incorrect object refs
		    date;
		this._unitOfWeight = unitOfWeight;
		this._meta = meta;
	}
	getDate() { return this._workoutDate; }
	getUnitOfWeight() { return this._unitOfWeight; }
	getMeta() { return this._meta; }

	isValid() {
		return !!this._workoutDate;
	}

	toString() {
		if (!this.isValid()) { return this._meta; }
		var
			dateStr = friendlyStrFromDate(this._workoutDate),
			units = this._unitOfWeight,
			meta = this._meta ? '(' + this._meta + ')' : '';

		return [dateStr, units, meta].join(' ');
	}

	render() {
		return '<div class="workout-header">' +
			this.toString() +
		'</div>';
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
 * @param {Workset|Array<Workset>} worksets
 * @param {JSON} warmupSchema
 * @return {Array<ExerciseSet>} warmup sets
 */
export function getWarmupsForWorksets(worksets, warmupSchema) {
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

export class ExerciseSetCollection {
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

	toString() {
		return this._name + ' ' +
		       _.invoke(this._sets, 'toString').join(', ') + ' ' +
		      this._exerciseMeta.toString();
	}
	render() {
		return this._name + ' ' +
		       _.invoke(this._sets, 'render').join(', ') + ' ' +
		      this._exerciseMeta.render();
	}
}

export class ExerciseMeta {
	constructor (metaText) {
		this._text = metaText ? metaText : '';
	}

	toString() { return this._text; }
	render() { return this._text; }
}

export class ExerciseSet {
	constructor() {
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

export class Workset extends ExerciseSet {
	constructor(sets, reps, weight, comments) {
		super();
		this._sets = sets;
		this._reps = reps;
		this._weight = weight;
		this._comments = new ExerciseMeta(comments);
		this._isWorkset = true;
	}

	setWeight(weight) {
		this._weight = weight;
	}

	render() { return this.toString(); }
}

/*
window.WorkoutsView2 = class WorkoutsView {
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
*/

_.each([Workout, ExerciseSet, WorkoutHeader, ExerciseSetCollection, ExerciseMeta],
	o => { o.tryCreate = createMixin; });

