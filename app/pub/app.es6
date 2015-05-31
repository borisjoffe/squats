import { render } from 'util';
import { Store } from 'storage';
//import ProgramGeneratorView from 'program-generator';
//import ProgramEditorView from 'program-editor';
//import { ViewSwitcher } from 'workout-components';

$.get('/workouts', function (data) {
	var hash = data.hashcode,
		workouts = data.workouts;
		//view = new WorkoutsView(data.workouts);

	if (!(workouts instanceof Workouts)) {
		workouts = parseWorkouts(workouts);
	}

	var storage = new Store();
	storage.set('workoutLog', workouts);

	//$('#workouts-section').append(view.render());
	render('workouts')(WorkoutLogView)({workouts: workouts});
});

// program section
var renderProgramSection = render('program-generator')(ProgramGeneratorView);
render('program-editor')(ProgramEditorView)(null);

render('view-switcher')(ViewSwitcher)({tabs: [['workouts', 'Workouts'], ['program', 'Edit Program']]});


