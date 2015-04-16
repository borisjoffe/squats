
/**
 * @param {Date} this.props.initialDate
 */
class DatePicker extends React.Component {
	handleChange() {
		// update program generator props
		log('here', arguments);
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
				<input type='date' onChange={ handleChange } defaultValue={ initialDateString } />
			</div>
		);
	}
}

class ProgramEditorView extends React.Component {
	render() {
		return (
			<DatePicker />
		);
	}
}
