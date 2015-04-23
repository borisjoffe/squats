//import WorkoutsView from 'WorkoutsView';

$.get('/workouts', function (data) {
	var hash = data.hashcode,
		view = new WorkoutsView(data.workouts);

	$('#workouts-section').append(view.render());
});

render('program-editor')(ProgramEditorView)(null);

var renderProgramSection = render('program-section')(ProgramGeneratorView);

renderProgramSection({
	program: programs.omcadv,
	user: user
});
