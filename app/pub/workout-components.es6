class ExerciseSetView extends React.Component {
	render() {
		var set = this.props.set;
		return (
			<span className='exercise-set'>
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
