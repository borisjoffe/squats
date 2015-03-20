'use strict'

workouts = $.get('/workouts', (data) ->
	data = JSON.parse data # temporary until content-type is changed to json
	hash = data.hashcode
	workouts = new Workouts(data.workouts)
	view = new WorkoutsView(workouts)

	$('#workouts').append view.render()
)
