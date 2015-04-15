//import WorkoutsView from 'WorkoutsView';

$.get('/workouts', function (data) {
	var hash = data.hashcode,
		view = new WorkoutsView(data.workouts);

	$('#workouts-section').append(view.render());
});

React.render(
	<ProgramEditorView />,
	document.getElementById('program-editor')
);

React.render(
	<ProgramGeneratorView program={programs.omcadv} user={user}/>,
	document.getElementById('program-section')
);


var myProgram = new ProgramGenerator(programs.omcadv, user);
log(myProgram.getWorkouts())
