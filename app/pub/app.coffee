"use strict"

workouts = $.get('/workouts', (data) ->
	workouts = new Workouts(data)
	view = new WorkoutsView(workouts)

	$('#workouts').append view.render()
)
