import { /*log, warn, err, */trace, render, strFromDate } from 'util';
import { user, programs } from 'program-generator';
import { ProgramGeneratorView } from 'workout-components';

/**
 * @param {Date} this.props.initialDate
 */
class DatePicker extends React.Component {
	handleChange(e) {
		// update program generator props
		trace('new date', e.target.value);
		updateProgram({startDate: e.target.value});
	}

	componentWillMount() {
		// trigger initial render of program generator
		updateProgram({});
	}

	render() {
		var
			initialDate = this.props.initialDate || new Date(),
			initialDateString = strFromDate(initialDate);

		// input(type=date) not supported on Firefox, mobile Firefox
		// not sure about Chrome on Android, iOS Safari
		return (
			// add label text from props
			<div className='date-picker'>
				<input type='date' onChange={ this.handleChange } defaultValue={ initialDateString } />
			</div>
		);
	}
}

var renderProgramSection = render('program-generator')(ProgramGeneratorView);

var updateProgram = _.curry(function (program, updatesObj) {
	_.assign(program, updatesObj);
	trace('new program:', program);
	renderProgramSection({program: program, user: user});
})(_.cloneDeep(programs.omcadv));

export default class ProgramEditorView extends React.Component {
	render() {
		return (
			<DatePicker />
		);
	}
}
