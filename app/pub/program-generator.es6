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

user.max = _.zipObject([
	// Format: [ex, { X RM : WEIGHT}, ...],
	// 5x5RM = ~7.5% less than 1x5RM
	[ex.squat, {'5': 400}, {'5x5': 325}],
	[ex.bench, {'5': 240}, {'5x5': 205}],
	[ex.deadl, {'5': 250}, {'5x5': 210}],
	[ex.rows,  {'5': 170}, {'5x5': 325}]
]);

// Hybrid Advanced Madcow 5x5 with Olympic Weightlifting
// TODO: change from percent to functions that take in the user's historical numbers
programs.omcadv = {
	from5x5To1x5Percent: 1.0 - 0.075, // VALIDATE: 0 < x < 1
	phases: [
		// loading
		{
			numWeeks: 4,
			currentPrsInWeek: 3, // VALIDATE: x < numWeeks
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
		{}
	]
};

// Input


// View
var ProgramGeneratorView = React.createClass({
	render: function () {
		var text = "World";
		return <p>Hello {text}</p>
	}
});
