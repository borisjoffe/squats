cfg = window.cfg;

/**
 * @param {String} text e.g. 5x5:400
 * @returns ExerciseSet
 */
parseSet(text, cfg = cfg) {
	var [setsByReps, weight] = text.split(cfg.weightDelim);
	var [sets, reps] = text.split(cfg.setsByRepsDelim);
	var set = new ExerciseSet(sets, reps, weight);
	return set;
}

/**
 * @param {String} text e.g. "squat 1x5:350, 5x5:400"
 * @returns ExerciseSetCollection
 */
parseSets(text, cfg = cfg) {
	return new ExerciseSetCollection(text);
}
