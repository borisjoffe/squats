import { log, trace, warn, err, strFromDate } from 'util';
import { ExerciseSet, ExerciseMeta, ExerciseSetCollection, Workset, WorkoutHeader, Workout, Workouts, MetaSection } from 'workout';
import { ProgramGenerator } from 'program-generator';

export class ExerciseSetView extends React.Component {
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

export class ExerciseCollectionView extends React.Component {
	render() {
		var exerciseCollection = this.props.exerciseSetCollection,
			sets = exerciseCollection.getSets(),
			exerciseName = exerciseCollection.getName(),
			exerciseMeta = exerciseCollection.getMeta(),
			exerciseStr = _.compact([
					exerciseName,
					sets.join(', '),
					exerciseMeta
				]).join(' '),
			lastSetIdx = sets.length - 1;

		return (
			<div className='exercise-set-collection'>
				<textarea defaultValue={exerciseStr} className='edit-mode' />

				<span className='exercise-name display-mode'>
				{ exerciseName }
				</span>
				&nbsp;

				<span className='exercise-sets display-mode'>
				{ sets.map((set, idx) =>
				    <ExerciseSetView key={idx} set={set} lastSet={idx === lastSetIdx}/>) }
				</span>
				
				<span className='exercise-meta display-mode'>
				{ exerciseMeta }
				</span>
			</div>
		);
	}
}

export class WorkoutHeaderView extends React.Component {
	render() {
		var header = this.props.header;
		return (
			<span className='workout-header'>
				<input type='date' className='edit-mode' defaultValue={ strFromDate(header.getDate()) } />
				<input type='text' className='edit-mode' defaultValue={ header.getUnitOfWeight() } />
				<input type='text' className='edit-mode' defaultValue={ header.getMeta() } />

				<span className='display-mode'>{header.toString()}</span>
			</span>
		);
	}
}

export class WorkoutView extends React.Component {
	constructor() {
		super();
		this.state = {editable: false};
	}

	handleEdit() {
		this.setState({editable: !this.state.editable});
	}

	render() {
		var workout = this.props.workout;

		// FIX: why doesn't handleEdit auto-bind to `this` for ES6 classes?
		var handleEdit = this.handleEdit.bind(this);

		return (
			<div className={ 'workout ' + (this.state.editable ? 'show-edit-mode' : 'show-display-mode') }>

				<WorkoutHeaderView header={ workout.getHeader() } />

				<button className='edit-workout' onClick={handleEdit}>{ this.state.editable ? 'Cancel' : 'Edit' }</button>

				{ workout.getExerciseSets().map((exercise, idx) =>
					<ExerciseCollectionView
					    key={idx}
					    exerciseSetCollection={exercise}
					    className='exercise-sets display-mode' />) }
			</div>
		);
	}
}

export class ProgramGeneratorView extends React.Component {
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

export class MetaSectionView extends React.Component {
	render() {
		return (
			<div className="meta-section">
				{ this.props.meta }
			</div>);
	}
}

export class WorkoutLogView extends React.Component {
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

export class Tab extends React.Component {
	render() {
		var idAndName = this.props.idAndName
		return <span className='view-switcher tab' data-id={ idAndName[0] }>{ idAndName[1] }</span>
	}
}

export class ViewSwitcher extends React.Component {
	handleClick(e) {
		var sectionToShow = e.target.dataset.id;
		trace('switch to', sectionToShow, 'tab');
		_.map($('.section'), (section => {
			$(section).toggleClass('hidden', section.id !== sectionToShow);
		}));
	}

	render() {
		var tabsArr = this.props.tabs,
			handleClick = this.handleClick.bind(this); // TODO: fix autobind
		return (
			<div className='view-switcher' onClick={handleClick}>
				{ tabsArr.map((tab, tabIdx) =>
					<Tab idx={tabIdx} idAndName={tab} />) }
			</div>
		);
	}
}
