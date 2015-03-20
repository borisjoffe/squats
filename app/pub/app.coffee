'use strict'

workouts = $.get('/workouts', (data) ->
	hash = data.hashcode
	workouts = new Workouts(data.workouts)
	view = new WorkoutsView(workouts)

	$('#workouts').append view.render()
)
