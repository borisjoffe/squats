//import WorkoutsView from 'WorkoutsView';

$.get('/workouts', function (data) {
	var hash = data.hashcode;
		//view = new WorkoutsView(data.workouts);

	//$('#workouts-section').append(view.render());
	render('workouts-section')(WorkoutLogView)({workouts: data.workouts});
});

render('program-editor')(ProgramEditorView)(null);
