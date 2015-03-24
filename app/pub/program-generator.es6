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
	squat: "squat",
	bench: "bench",
	deadl: "dead/l",
	press: "press",
	rows: "rows",

	// oly
	cj: "c+j",
	sn: "snatch",
	cpj: "c+pj",
	fsq: "fsquat"
};

var ex = EXERCISES;

// Hybrid Advanced Madcow 5x5 with Olympic Weightlifting
programs.omcadv = {
	phases: [
		// loading
		{
			numWeeks: 4,
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

