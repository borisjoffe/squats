class ExerciseSetView extends React.Component {
	render() {
		var set = this.props.set;
		var isWorkset = set instanceof Workset;
		return (
			<span className={ 'exercise-set ' + isWorkset ? 'work-set' : 'warmup-set'}>
				{ set.toString() }
				{ this.props.lastSet ? '' : ', ' }
			</span>
		);
	}
}

class ExerciseCollectionView extends React.Component {
	render() {
		var exercises = this.props.exerciseSetCollection,
			sets = exercises.getSets(),
			lastSetIdx = sets.length - 1;

		return (
			<div className='exercise-set-collection'>
				<span className='exercise-name'>
				{ exercises.getName() }
				</span>
				&nbsp;

				<span className='exercise-sets'>
				{ sets.map((set, idx) =>
				    <ExerciseSetView key={idx} set={set} lastSet={idx === lastSetIdx}/>) }
				</span>
				
				<span className='exercise-meta'>
				{ exercises.getMeta() }
				</span>
			</div>
		);
	}
}

class WorkoutHeaderView extends React.Component {
	render() { return <span>{this.props.header.toString()}</span>; }
}

class WorkoutView extends React.Component {
	constructor() {
		this.state = {editable: false};
	}

	handleEdit() {
		this.setState({editable: !this.state.editable});
	}

	render() {
		var workout = this.props.workout;
		log('state', this.state);
		return (
			<div className='workout'>

				<textarea className={ this.state.editable ? '' : 'hidden' } value={ workout.toString() } />

				<WorkoutHeaderView
				    header={ workout.getHeader() }
				    className={ this.state.editable ? 'hidden' : 'workout-header' }
					editable={ this.state.editable } />

				<button className='edit-workout' onClick={this.handleEdit}>Edit</button>

				{ workout.getExerciseSets().map((exercise, idx) =>
					<ExerciseCollectionView
					    key={idx}
					    exerciseSetCollection={exercise}
					    className={ this.state.editable ? 'hidden' : 'exercise-sets' }
					    editable={ this.state.editable } />) }
			</div>
		);
	}
}

class ProgramGeneratorView extends React.Component {
	render() {
		var myProgram = ProgramGenerator.tryCreate(..._.values(this.props));
		if (!myProgram) err('Could not generate program from data');
		log(myProgram);
		var workouts = myProgram.getWorkouts();
		return (
			<div className='program'>
				<h2>Your program</h2>
				{ workouts.map((workout, idx) =>
				    <WorkoutView key={idx} workout={workout} />) }
			</div>
		);
	}
}

var renderProgramSection = render('program-section')(ProgramGeneratorView);

class MetaSectionView extends React.Component {
	render() {
		return (
			<div className="meta-section">
				{ this.props.meta }
			</div>);
	}
}

class WorkoutLogView extends React.Component {
	render() {
		var myWorkouts = this.props.workouts;
		log(myWorkouts);
		return (
			<div className='workouts-view'>
				<h2>Your workouts</h2>
				{ myWorkouts.getAll().map((workoutOrMeta, idx) => {
					return (workoutOrMeta instanceof Workout) ?
				    <WorkoutView key={idx} workout={workoutOrMeta} /> :
					<MetaSectionView key={idx} meta={workoutOrMeta} /> }) }
			</div>
		);
	}
}
