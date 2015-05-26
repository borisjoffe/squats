import cfg from 'hello';
//import cfg from './config';
//var cfg = require('config');

const WORKOUT_SEPARATOR = '\n\n';
const WHITESPACE = /\s/;

/**
 * @param {String} text e.g. 5x5:400
 * @returns {ExerciseSet}
 */
function parseExerciseSet(text) {
	var [setsByReps, weight] = text.split(cfg.weightDelim);
	var [sets, reps] = setsByReps.split(cfg.setsByRepsDelim);
	var set = new ExerciseSet(sets, reps, weight);
	return set;
}

/**
 * @param {String} single line of text
 * @return {Array<String>} array of length 2 of [text, comment]
 *    where the first element is the text
 *    and the second element is the comment (with commentStart character)
 *    whitespace between text and comment is removed
 *    if the whole line is a comment, returns null for the text
 */
function splitOnComment(text) {
	text = text.trim();
	var idxCommentStart = text.indexOf(cfg.commentStart);
	if (idxCommentStart === -1) { return [text, '']; }
	else if (idxCommentStart === 0) { return [null, text]; }
	else return [
		text.substring(0, idxCommentStart),
		text.substring(idxCommentStart)
	];
}

/**
 * @param {String} text e.g. "squat 1x5:350, 5x5:400 (some comment)"
 * @returns {ExerciseSetCollection|ExerciseMeta} returns ExerciseMeta if no exercise sets found
 */
function parseExerciseSetCollection(originalText) {
	const EXERCISE_SET_SEPARATOR = /,\s*/;
	var [text, comment] = splitOnComment(originalText);
	if (!text) {
		return new ExerciseMeta(originalText);
	}
	comment = new ExerciseMeta(comment);
	var
		[exerciseName, ...setString] = text.split(WHITESPACE),
		exerciseSetArray = setString.join('')
		                            .split(EXERCISE_SET_SEPARATOR)
		                            .map(parseExerciseSet);
	return new ExerciseSetCollection(exerciseName, exerciseSetArray, comment);
}

/**
 * @param {String} text e.g. "2015/04/01  lbs (omcadv5 - load1 - mon workout) 200 shoes (17:00-18:00, had 1 coffee)"
 * @returns {WorkoutHeader}
 */
function parseWorkoutHeader(text) {
	if (text.startsWith('('))
		return null;

	var
		date = getDate(text),
		units = getUnitOfWeight(text),
		meta = getProp(text.match(/\(([^\)]*)\)/), [1]);


	return new WorkoutHeader(date, units, meta);
}

/**
 * @param {String} text e.g. one WorkoutHeader line followed by 3 ExerciseSetCollection lines
 * @returns {Workout|MetaSection}
 */
function parseWorkout(text) {
	const EXERCISE_SEPARATOR = '\n';

	if (typeof text !== 'string')
		return new MetaSection(text);
	var [headerText, ...exerciseSetCollections]  = text.split(EXERCISE_SEPARATOR);
	var header = parseWorkoutHeader(headerText);
	if (!header || !header.isValid())
		return new MetaSection(text);
	var exercises = exerciseSetCollections.map(parseExerciseSetCollection);
	return new Workout(header, exercises);
}

/**
 * @param {String} text e.g. multiple Workouts and/or MetaSections
 * @returns {Workouts}
 */
function parseWorkouts(text) {
	var workouts = text.split(WORKOUT_SEPARATOR).map(parseWorkout);
	return new Workouts(workouts);
}

