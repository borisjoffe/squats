// Workout programs
window.programs = {};

// TODO: il8n - some locales start with sunday
var DAYS = {
	MON: "mon",
	TUE: "tue",
	WED: "wed",
	THU: "thu",
	FRI: "fri",
	SAT: "sat",
	SUN: "sun"
};

var EXERCISES = {
	// powerlifting
	squat : "squat",
	bench : "bench",
	deadl : "dead/l",
	press : "press",
	rows  : "rows",

	// oly
	cj  : "c+j",
	sn  : "snatch",
	cpj : "c+pj",
	fsq : "fsquat"
};

var ex = EXERCISES;

window.users = [];
window.user = {};
users.push(user);

user.maxes = _.zipObject([
	// Format: [ex, { X RM : WEIGHT}, ...],
	// 5x5RM = ~7.5% less than 1x5RM
	[ex.squat, {'5': 400, '5x5': 325}],
	[ex.bench, {'5': 240, '5x5': 205}],
	[ex.deadl, {'5': 250, '5x5': 210}],
	[ex.rows,  {'5': 170, '5x5': 325}]
]);

// Hybrid Advanced Madcow 5x5 with Olympic Weightlifting
// TODO: change from percent to functions that take in the user's historical numbers
programs.omcadv = {
	from5x5To1x5Percent: 1.0 - 0.075, // VALIDATE: 0 < x < 1
	phases: [
		// loading
		{
			numWeeks: 4,
			weekOfCurrentPrs: 3, // VALIDATE: x < numWeeks
			weekOnePercentOfPr: 0.8, // VALIDATE: 0 < x < 1
			prJumpPercent: 0.05, // VALIDATE: percent
			days: [DAYS.MON, DAYS.WED, DAYS.FRI, DAYS.SAT, DAYS.SUN],

			// VALIDATE: days.length === workouts.length
			workouts: [
				// day 1
				[   { ex: ex.squat, sets: 5, reps: 5 },
				    { ex: ex.bench, sets: 1, reps: 5 },
				    { ex: ex.rows,  sets: 1, reps: 5 } ],

				// day 2
				[   { ex: ex.squat, sets: 5, reps: 5 },
				    { ex: ex.bench, sets: 1, reps: 5 },
				    { ex: ex.rows,  sets: 1, reps: 5 } ]
			]
		},
		// intensity option 1 - Deload and Peak 3x3
		//{}
	]
};

// Input
class ProgramGenerator {
	constructor(program, user) {
		this.maxes = user.maxes;
		this.program = program;
		this.isValid = ProgramGenerator.validate(program);

		this.phases = this.makePhases();
	}

	static validate(program) {
		return true;
	}

	render() {
		return toHtml(this.phases);
	}

	getWarmupsForWorkset(workset, context) {
	}

	getWorksetForWeek(weekIdx, exercise, maxes, workoutSchema) {
		var
			weekOfCurrentPrs = workoutSchema.weekOfCurrentPrs,
			weekOnePct       = workoutSchema.weekOnePercentOfPr,
			prJumpPct        = workoutSchema.prJumpPercent,

			sxr            = ExerciseSet.toShortString(exercise.sets, exercise.reps),
			lastPr         = maxes[exercise.ex][sxr],
			weeklyPctJumps = (1 - weekOnePct) / (weekOfCurrentPrs - 1),

			workset = new Workset(exercise.sets, exercise.reps),
			weight;

		if (!isFinite(lastPr)) {
			warn('lastPr is not finite. It is', lastPr);
		}

		if (weekIdx <= weekOfCurrentPrs) {
			// e.g. week 1 is 0.8 + (0 * .10) * 300lbs
			weight = (weekOnePct + (weekIdx * weeklyPctJumps)) * lastPr;
		} else {
			weight = lastPr * (1 + prJumpPercent * weekIdx);
		}

		workset.setWeight(weight);
		return workset;
	}

	// Each day, get workset
	makeWorkout(day, maxes, workoutSchema) {
		var
			workout;

		workout = day.map(
			// map over each day
			_.partial(this.getWorksetForWeek, weekIdx, _, maxes, workoutSchema)
		);

		return workout;
	}

	makeWorkoutsForWeek(weekIdx, maxes, workoutSchema) {
		return workoutSchema.workouts.map(
			// Map workouts for each day
			_.partial(this.makeWorkout, _, maxes, workoutSchema)
		);
	}

	makePhases() {
		var maxes = this.maxes;

		return this.program.phases.map(phase => {
			var numWeeks = phase.numWeeks;
debugger;
			// Map workouts for each week
			var workoutsThisPhase =
				_.range(numWeeks)
				.map(_.partial(this.makeWorkoutsForWeek, _, maxes, phase));

			return workoutsThisPhase;
		});
	}
}

// View
//var ProgramGeneratorView = React.createClass(ProgramGenerator);
var ProgramGeneratorView = React.createClass({
	render: function () {
		var text = "World";
		return <p>Hello {text}</p>
	}
});
