WORKOUT_SEPARATOR = '\n\n'


toHtml = (text) ->
	text.replace(/\n/g, '<br>')

Workouts = (text) ->
	this._chunks = text.split(WORKOUT_SEPARATOR)
	this._sections = this._chunks.reduce((sections, section, idx) ->
		# TODO: add workout validator static method
		# TODO: abstract this logic out to allow for more types of content
		w = new Workout(section)
		if w.isValid()
			sections.push(w)
		else
			m = new MetaSection(section)
			sections.push(m)
		sections
	, [])
	this

Workouts.prototype.getAll = () ->
	this._sections.slice()

MetaSection = (sectionText) ->
	this._meta = sectionText
	this

MetaSection.prototype.render = () ->
	'<div class="meta-section">' +
		toHtml(this._meta) +
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
		toHtml(this._text) +
	'</div>'

Exercises = (exercises) -> this

WorkoutsView = (workouts) ->
	html = []

	workouts.getAll().forEach (section) ->
		html.push section.render()

	this._html = html.join('')
	this

WorkoutsView.prototype.render = () ->
	this._html

window.Workouts     = Workouts
window.WorkoutsView = WorkoutsView
