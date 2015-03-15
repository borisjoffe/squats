WORKOUT_SEPARATOR = '\n\n'

Workouts = (text) ->
	this._chunks = text.split(WORKOUT_SEPARATOR)
	meta = this._meta = new WorkoutsMeta()
	lastMetaIdx = -1
	this._workouts = this._chunks.reduce((workouts, workoutChunk, idx) ->
		w = new Workout(workoutChunk)
		if w.isValid()
			workouts.push(w)
		else
			if lastMetaIdx + 1 is not idx
				console.warn 'Meta section found after a valid workout. Meta idx was', idx
			else
				lastMetaIdx += 1
			meta.add(workoutChunk)

		workouts
	, [])
	this

Workouts.prototype.getAll = () ->
	this._workouts.slice()

Workouts.prototype.getAllMeta = () ->
	this._meta.getAll()

Workouts.prototype.renderMeta = () ->
	this._meta.render()

WorkoutsMeta = (textChunks) ->
	this._meta = []
	this

WorkoutsMeta.prototype.add = (metaText) ->
	this._meta.push(metaText)

WorkoutsMeta.prototype.getAll = () ->
	this._meta.slice()

WorkoutsMeta.prototype.render = () ->
	'<div class="meta">' +
		this._meta.map((metaSection) ->
			'<div class="meta-section">' +
				metaSection +
			'</div>').join('') +
	'</div>'

Workout = (workoutText) ->
	this._chunks = workoutText.split('\n')
	this._header = new WorkoutHeader(this._chunks[0])
	this._exercises = this._chunks.slice(1)
	this

Workout.prototype.isValid = () ->
	this._header.isValid()

Workout.prototype.render = () ->
	'<div class="workout">' +
		this._header.render() +
		this._exercises.join('') +
	'</div>'

WorkoutHeader = (headerText) ->
	DATE_REGEXP = /(\d+\/\d+\/\d+)\s/
	this._text = headerText
	this._workoutDate = headerText.match(DATE_REGEXP)?[1]
	this

WorkoutHeader.prototype.isValid = () ->
	!!this._workoutDate

WorkoutHeader.prototype.render = () ->
	'<div class="workout-header">' +
		this._text +
	'</div>'

Exercises = (exercises) -> this

WorkoutsView = (workouts) ->
	html = []

	html.push workouts.renderMeta()

	workouts.getAll().forEach (workout) ->
		html.push workout.render()

	this._html = html.join('')
	this

WorkoutsView.prototype.render = () ->
	this._html

window.Workouts     = Workouts
window.WorkoutsView = WorkoutsView
