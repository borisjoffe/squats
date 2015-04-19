
/**
 * @param {Date} this.props.initialDate
 */
class DatePicker extends React.Component {
	handleChange(e) {
		// update program generator props
		log('new date', e.target.value);
		updateProgram({startDate: e.target.value});
	}

	render() {
		var
			initialDate = this.props.initialDate || new Date(),
			initialDateString = initialDate.toISOString().split('T')[0];

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

var updateProgram = _.curry(function (program, updatesObj) {
	_.assign(program, updatesObj);
	log('new program:', program);
	renderProgramSection({program: program, user: user});
})(programs.omcadv);

class ProgramEditorView extends React.Component {
	render() {
		return (
			<DatePicker />
		);
	}
}
