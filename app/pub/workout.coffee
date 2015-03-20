WORKOUT_SEPARATOR = '\n\n'
WHITESPACE = '\s'

toHtml = (text) ->
	if Array.isArray text
		text.join '<br>'
	else
		text.replace(/\n/g, '<br>')

chop = (text, textToChop) ->
	if typeof text is not 'string'
		text
	else
		text.replace(textToChop, '')

# Takes in text containing slash separated date e.g. 2015/03/01
# returns first date found as unix time
# returns null if no date found
# TODO: adjust for timezones
getDate = (text, context) ->
	WORKOUT_HEADER_DATE_REGEXP = /(\d+\/\d+\/\d+)\s/
	dateString = text.match(WORKOUT_HEADER_DATE_REGEXP)?[1]
	if !dateString
		null
	else
		dateString.replace(/\//g, '-')
		Date.parse(dateString)

# Takes in text containing unit of weight
# returns first unit of weight found
# returns user's default unit of weight if no date found
getUnitOfWeight = (text, context) ->
	if (text.contains('lbs') or text.contains('lb'))
		cfg.unitOfWeight.pounds
	else if (text.contains('kgs') or text.contains('kg'))
		cfg.unitOfWeight.kilos
	else
		cfg.unitOfWeight.DEFAULT

getExerciseName = (text) -> text

# TODO: partition text / comments somehow
splitComments = (text) ->
	[text]

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
	EXERCISE_SEPARATOR = '\n'
	@_chunks = workoutText.split(EXERCISE_SEPARATOR)
	@_header = new WorkoutHeader(@_chunks[0])
	@_exercises = []
	for exerciseText in @_chunks[1..]
		@_exercises.push(new Exercise(exerciseText))
	this

Workout::isValid = () -> this._header.isValid()

Workout::render = () ->
	'<div class="workout">' +
		@_header.render() +
		toHtml(@_exercises.map((exercise) -> exercise.render())) +
	'</div>'

WorkoutHeader = (headerText) ->
	txt = headerText
	@_text = txt

	@_workoutDate = getDate(txt)

	@_workoutUnitOfWeight = getUnitOfWeight(txt)

	@_meta = WorkoutHeader.getMeta(txt)

	this

WorkoutHeader::isValid = () -> !!this._workoutDate

WorkoutHeader::render = () ->
	'<div class="workout-header">' +
		toHtml(this._text) +
	'</div>'

WorkoutHeader.getMeta = (text) ->
	text.match(/\(([^\)]*)\)/)?[1]

Exercise = (exerciseText) ->
	# TEXT FORMAT: EXERCISE_NAME COMMA_SEPARATED_SETS OPTIONAL COMMENT
	@_text = exerciseText
	@_sections = exerciseText.split(WHITESPACE)
	@_name = getExerciseName @_sections[0]
	@_sets = @_sections[1..]
	@_comments = ''
	this

Exercise::render -> @_text
Exercise::isValid -> !!@_name and !!@_sets

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
