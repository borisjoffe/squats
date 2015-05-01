//import WorkoutsView from 'WorkoutsView';

$.get('/workouts', function (data) {
	var hash = data.hashcode;
		workouts = data.workouts;
		//view = new WorkoutsView(data.workouts);

	if (!(workouts instanceof Workouts)) {
		workouts = parseWorkouts(workouts);
	}

	var storage = new Storage();
	storage.set('workoutLog', workouts);

	//$('#workouts-section').append(view.render());
	render('workouts-section')(WorkoutLogView)({workouts: workouts});
});

render('program-editor')(ProgramEditorView)(null);
