Squats
=====
Create, Track, and Analyze Powerlifting and Olympic Weightlifting workouts
-----
These Python scripts are being transitioned into a web app. To use them now, you should create symbolic links in a directory in your `$PATH` pointing to these scripts to avoid typing the `.py` file extension all the time. For example, use `ln -s -T /your/directory/with/these/scripts/plates.py /a/directory/in/your/path/plates` to use `plates` to execute the script instead of `plates.py`



plates.py
------
`plates` calculates the breakdown of what plates to load on the bar depending on what weights you are lifting for each set. You can either pass it whitespace delimited arguments directly on the command line inserting the word `BREAK` when you are switching exercises, or you can let it automatically find your workout file and calculate the plates breakdown for all sets. The default workout file is set to `/home/boris/fitness/sl5x5.txt` in the file `workoutlog.py` which you can change manually. Additionally, the `--auto` option only looks 2 days ahead. Change `max_future_days` in `workoutlog.py` to modify this and related behavior.

You can pass this script several types of arguments:

	Usage:	./plates [space separated list of weights] [either 'kg' or 'lbs']
			./plates --auto		Read next workout automatically from main file


Some examples can be seen below. Use `--auto` functionality to read and display the plates breakdown for your next workout.

	$ plates --auto
	==== NEXT WORKOUT on 2013/03/30 ====
	Set #1 = 45lb
	Set #2 = 95lbs
	25
	Set #3 = 115lbs
	35
	Set #4 = 135lbs
	P
	Set #5 = 150lbs
	P, 5, 2.5

	----- Next Exercise -----

	Set #1 = 95lbs
	25
	Set #2 = 115lbs
	35
	Set #3 = 125lbs
	35, 5

or manually specify weights in pounds:

	$ plates 155 255 355 lb
	Set #1 = 155lbs
	P, 10
	Set #2 = 255lbs
	2P, 10, 5
	Set #3 = 355lbs
	3P, 2x10

or specify weights in kilograms:

	$ plates 80 100 120 kg
	Set #1 = 80kg
	p, 5
	Set #2 = 100kg
	p, 15
	Set #3 = 120kg
	2p

or specify multiple exercises:

	$ plates 185 255 355 BREAK 145 175 205 lb
	Set #1 = 185lbs
	P, 25
	Set #2 = 255lbs
	2P, 10, 5
	Set #3 = 355lbs
	3P, 2x10

	----- Next Exercise -----
	Set #5 = 145lbs
	P, 5
	Set #6 = 175lbs
	P, 2x10
	Set #7 = 205lbs
	P, 35


workout.py
---------
This calculates workouts for the [Madcow 5x5 Intermediate Program (Linear)](http://stronglifts.com/madcow/5x5_Program/Linear_5x5.htm). Barbell rows are substituted with power cleans (can be reversed by changing `MC_PCLEANS`) and certain cutoffs for minimum weights to be used on military press, power cleans, and barbell rows exist.


	Usage: ./workout.py [OPTIONS] or python workout.py [OPTIONS]
		-h		Displays this message
		[OPTIONS]	bodyweight, clothes, day, worksets for first 3 exercises, units


Input `0` for bodyweight and `""` for clothes to leave these out. `day` can be "mon", "wed", or "fri"

An example case is shown here:

	$ workout 0 "" mon 425 255 165 lb
	2013/03/30 lbs (mon workout)
		squat	1x5:165, 1x5:235, 1x5:295, 1x5:355, 1x5:425
		bench	1x5:95, 1x5:135, 1x5:175, 1x5:215, 1x5:255
		pclean	1x5:65, 1x5:85, 1x5:115, 1x5:135, 1x5:165

	2013/03/30 lbs (mon workout)
			P, 10, 5  /  2P, 5  /  2P, 35  /  3P, 2x10  /  4P, 10  /
		squat	1x5:165, 1x5:235, 1x5:295, 1x5:355, 1x5:425

			25  /  P  /  P, 2x10  /  P, 35, 5  /  2P, 10, 5  /
		bench	1x5:95, 1x5:135, 1x5:175, 1x5:215, 1x5:255

			10  /  2x10  /  35  /  P  /  P, 10, 5  /
		pclean	1x5:65, 1x5:85, 1x5:115, 1x5:135, 1x5:165


The top version can be put in your workout log and the bottom version can be printed out to take to the gym.


workoutlog.py
------------
This takes no arguments as of now and just finds your next workout in the next 2 days (if applicable) and prints it out so you don't have to open the file. It also has some helper functions that `plates.py` uses

	$ workoutlog
	2013/03/30	lbs (madcow2 - load wk2 - wed workout)
		squat	1x5:165, 1x5:235, 1x5:295, 1x5:355, 1x5:425
		bench	1x5:95, 1x5:135, 1x5:175, 1x5:215, 1x5:255
		pclean	1x5:65, 1x5:85, 1x5:115, 1x5:135, 1x5:165

License
-------
Copyright Boris Joffe 2011-2016 
Licensed under the AGPL Version 3.0
