workouts = $.get('/workouts', (data) ->
	console.log arguments
	$('#workouts').append data
)
