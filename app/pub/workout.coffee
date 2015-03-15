WORKOUT_SEPARATOR = '\n\n'

Workouts = (text) ->
	this._chunks = text.split(WORKOUT_SEPARATOR)
	meta = this._meta = new WorkoutsMeta()
	this._workouts = this._chunks.reduce((workouts, workoutChunk, idx) ->
		w = new Workout(workoutChunk)
		if w.isValid()
			workouts.push(w)
		else
			meta.add(workoutChunk)

		workouts
	, [])
	this

Workouts.prototype.getAll = () ->
	this._workouts.slice()

Workouts.prototype.getAllMeta = () ->
	this._meta.getAll()

WorkoutsMeta = (textChunks) ->
	this._meta = []
	this

WorkoutsMeta.prototype.add = (metaText) ->
	this._meta.push(metaText)

WorkoutsMeta.prototype.getAll = () ->
	this._meta.slice()

Workout = (workoutText) ->
	this._chunks = workoutText.split('\n')
	this._header = new WorkoutHeader(this._chunks[0])
	this._exercises = this._chunks.slice(1)
	this

Workout.prototype.isValid = () ->
	this._header.isValid()

WorkoutHeader = (headerText) ->
	DATE_REGEXP = /^(\d+\/\d+\/\d+)\s/
	this._workoutDate = headerText.match(DATE_REGEXP)?[1]
	this

WorkoutHeader.prototype.isValid = () ->
	!!this._workoutDate

Exercises = (exercises) -> this

WorkoutsView = (workouts) ->
	html = []

	html.push workouts.getAllMeta().map (metaSection) ->
		'<div class="meta">' +
			metaSection +
		'</div>'


	html.push workouts.getAll().map (workout) ->
		'<div class="workout">' +
			workout +
		'</div>'

	this._html = html.join('')
	this

WorkoutsView.prototype.render = () ->
	this._html

window.Workouts     = Workouts
window.WorkoutsView = WorkoutsView
