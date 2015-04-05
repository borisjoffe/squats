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

	getWorkouts() { return _.flatten(this.phases, true); }

	static validate(program) {
		return true;
	}

	validate() { ProgramGenerator.validate.apply(this, arguments); }

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

		workset.setWeight(round(weight));
		return workset;
	}

	// Each day, get workset
	makeWorkout(day, weekIdx, maxes, workoutSchema) {
		var
			workout = new Workout(
				new WorkoutHeader("2015/04/01"),
				day.map(
					// map over each exercise creating worksets
					_.bind(this.getWorksetForWeek, this, weekIdx, _, maxes, workoutSchema)
				)
			);

		return workout;
	}

	makeWorkoutsForWeek(weekIdx, maxes, workoutSchema) {
		return workoutSchema.workouts.map(
			// Map workouts for each day
			_.bind(this.makeWorkout, this, _, weekIdx, maxes, workoutSchema)
		);
	}

	makePhases() {
		var maxes = this.maxes;

		return this.program.phases.map(phase => {
			var numWeeks = phase.numWeeks;
			// Map workouts for each week
			var workoutsThisPhase =
				_.range(numWeeks)
				.map(_.bind(this.makeWorkoutsForWeek, this, _, maxes, phase));

			return workoutsThisPhase;
		});
	}
}
ProgramGenerator.tryCreate = createMixin;

// View
class ProgramGeneratorView extends React.Component {
	// why is this not getting called??
	getInitialState() {
		log('setting state from props', this.props);
		var myProgram = ProgramGenerator.tryCreate.apply(ProgramGenerator, this.props);
		if (!myProgram) { err('Could not generate program from data'); }
		return {
			program: myProgram
		};
	}

	render() {
		var myProgram = ProgramGenerator.tryCreate.apply(ProgramGenerator, _.values(this.props));
		if (!myProgram) { err('Could not generate program from data'); }
		var workouts = myProgram.getWorkouts();
		return (
			<div className='program'>
				<h2>Your program</h2>
				{ _.invoke(workouts, 'render') }
			</div>
		);
	}
}

