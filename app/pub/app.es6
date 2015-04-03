//import WorkoutsView from 'WorkoutsView';

$.get('/workouts', function (data) {
	var hash = data.hashcode,
		view = new WorkoutsView(data.workouts);

	$('#workouts').append(view.render());
});

React.render(
	<ProgramGeneratorView program={programs.omcadv} user={user}/>,
	document.getElementById('generator')
);

var myProgram = new ProgramGenerator(programs.omcadv, user);
log(myProgram.getWorkouts())
