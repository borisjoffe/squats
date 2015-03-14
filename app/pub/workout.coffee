WORKOUT_SEPARATOR = '\n\n'

Workouts = (text) ->
	this._workouts = text.split(WORKOUT_SEPARATOR)
	this

Workouts.prototype.getAll = () ->
	this._workouts.slice()


WorkoutsView = (workouts) ->
	html = ''

	for workout in workouts.getAll()
		html +=
			'<div class="workout">' +
				workout +
			'</div>'

	this._html = html
	this

WorkoutsView.prototype.render = () ->
	this._html

window.Workouts     = Workouts
window.WorkoutsView = WorkoutsView
