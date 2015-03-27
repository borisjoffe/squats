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

	makePhases() {
		var maxes = this.maxes;

		return this.program.phases.map(phase => {
			var numWeeks = phase.numWeeks,
				weekOfCurrentPrs = phase.weekOfCurrentPrs;

			return phase.workouts.map(workout => {
				workout.map(exercise => {
					var
						sxr = ExerciseSet.toShortString(exercise.sets, exercise.reps),
						lastPr = maxes[exercise.ex][sxr],
						weekOnePct = phase.weekOnePercentOfPr,
						weeklyPctJumps = (1 - weekOnePct) / (weekOfCurrentPrs - 1),
						prJumpPct = phase.prJumpPercent;

					if (!isFinite(lastPr)) {
						warn('lastPr is not finite. It is', lastPr);
					}

					log('exercise:', exercise, '| sxr:', sxr, '| lastPr:', lastPr);

					// 0 to numWeeks - 1
					var weights = _.range(numWeeks).map(week => {
						if (week <= weekOfCurrentPrs) {
							// e.g. week 1 is 0.8 + (0 * .10) * 300lbs
							return (weekOnePct + (week * weeklyPctJumps)) * lastPr;
						} else {
							return lastPr * (1 + prJumpPercent * week);
						}
					})
					.map(round);

					log(weights);

				});
			});
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
