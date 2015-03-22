import 'Workouts';
import 'WorkoutsView';

$.get('/workouts', function (data) {
	var hash = data.hashcode,
		workouts = new Workouts(data.workouts),
		view = new WorkoutsView(workouts);

	$('#workouts').append(view.render());
});
