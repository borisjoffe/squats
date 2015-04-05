class ExerciseSetView extends React.Component {
	render() {
		var set = this.props.set;
		return (
			<span className='exercise-set'>
				{ set.toString() }
			</span>
		);
	}
}

class ExerciseCollectionView extends React.Component {
	render() {
		var exercises = this.props.exerciseSetCollection;
		return (
			<div className='exercise-set-collection'>
				<span className='exercise-name'>
				{ exercises.getName() }
				</span>

				<span className='exercise-set-collection'>
				{ exercises.getSets().map((set, idx) =>
				    <ExerciseSetView key={idx} set={set} />).join(', ') }
				</span>
				
				<span className='exercise-meta'>
				{ exercises.getMeta() }
				</span>
			</div>
		);
	}
}

class WorkoutHeaderView extends React.Component {
	render() { return <span>{this.props.header}</span>; }
}

class WorkoutView extends React.Component {
	render() {
		var workout = this.props.workout;
		return (
			<div className='workout'>
				<WorkoutHeaderView
				    header={workout.getHeader()}
				    className='workout-header' />

				{ workout.getExerciseSets().map((exercise, idx) =>
					<ExerciseCollectionView
					    key={idx}
					    exerciseSetCollection={exercise}
					    className='exercise-sets' />) }
			</div>
		);
	}
}

class ProgramGeneratorView extends React.Component {
	/*
	// why is this not getting called??
	getInitialState() {
		log('setting state from props', this.props);
		var myProgram = ProgramGenerator.tryCreate.apply(ProgramGenerator, this.props);
		if (!myProgram) { err('Could not generate program from data'); }
		return {
			program: myProgram
		};
	}
	*/
	render() {
		var myProgram = ProgramGenerator.tryCreate.apply(
		    ProgramGenerator,
		    _.values(this.props));
		if (!myProgram) { err('Could not generate program from data'); }
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
