#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys, os, string, re, datetime;
import workoutlog
from utils import Err, ErrF, Dbg, check_sys

# TODO
# * MOST IMPORTANT TODO - lookahead for earlier workouts if possible (BUG)
# * Switch to Python3
# * Use argparse for args -- e.g. checkargs()
# * Add test suite
# * Fail during bad input e.g. input too low
# * Change program to ask for input if original input is insufficient instead of exiting
# * Take out DBGs eventually

# CHANGELOG
# * 2013-Mar-29 - Moved --auto to workoutlog.py as well as several other functions
# * 2013-Mar-16 - Added --auto functionality of reading from workout file
# * 2012-Feb-10 - Bug fix - changed plate arrays (added 35 back, took out largest plate), failed early for no input or bad lastarg
# * 2012-Feb-09 - Bug fixes in standalone functionality - truncated output on last set, verbose vs non verbose, always using PL instead of Oly, refactored check_sys to use MEAS instead of custom string, DEBUG constant vs DBG function in utils


# Constants
DBG = False

PL_BAR = 45		# 45lb powerlifting bar
OLY_BAR = 20	# 20kg olympic bar

PL_PLATE = 45	# 45lb highest powerlifting plate
OLY_PLATE = 25	# 25kg highest olympic plate

# TODO - put highest plate logic into the loop

pl_plates = [35, 25, 10, 5, 2.5]		# I don't use 1.25lb plates yet
all_pl_plates = [35, 25, 10, 5, 2.5, 1.25]
oly_plates = [20, 15, 10, 5, 2.5, 2, 1, 0.5]
oly_plates_color = ["red", "blue", "yellow", "green", "white", "grey2.5", "grey2", "grey1", "grey0.5"]

METRIC = "kg"
IMPERIAL = "lbs"

BREAK_MARK = "BREAK"
BREAK_STR = "\n----- Next Exercise -----\n";

# Global vars - If these vars are false, they are undefined
plates_arr = []
smallest_plate = 0
MEAS = False
BAR = False
PLATE = False

# Change these to your liking - defaults are lbs/powerlifting
DEFAULT_MEAS = IMPERIAL
DEFAULT_BAR = PL_BAR
DEFAULT_PLATE = PL_PLATE
DEFAULT_PLATES_ARR = pl_plates
NO_MEAS_SPECIFIED = False

def main():	
	# for every arg (which is a weight) except the last one
	weights = sys.argv
	
	del weights[0]						# Remove first arg (filename)
	if not NO_MEAS_SPECIFIED: del weights[len(sys.argv)-1]		# Remove last arg (measurement system) if meas system specified
	
	print calcplatearr(weights, 1, True, MEAS)
		
# Input array of weights to calculate and it will output the plates needed
# 	Arguments: weight array, 1??, whether to use multiple lines per weight or to compactly display it all on one line, measurement system
def calcplatearr(weights, i = 0, compact=True, SYS=DEFAULT_MEAS):
	arrstr = ""
	for k in range(0, len(weights)):
		if DBG: Dbg("Processing line " + str(k) + " with weight", weights[k]);
		if weights[k]==BREAK_MARK: arrstr += BREAK_STR; 	#insert visual line breaks if you want to put in multiple sets at once
		elif not compact:
			arrstr += calcplates(weights[k], k+1, compact, SYS) + '  /  '
		elif compact:
			arrstr += calcplates(weights[k], k+1, compact, SYS) + "\n"
		else:
			print "Error: 'plates.py' - 'compact' specification in calcplatearr incorrect"
			return
	return arrstr[:-1]
	
# Calculate the plates for a specfied weight
# 'i' is the set number
# If verbose is off, only display one line of concise plate output
def calcplates(weight, i = 0, compact=True, SYS=DEFAULT_MEAS):
		if set_program( check_sys(string.lower(SYS)) ) == -1:
			ErrF("'plates.py' - Setting program to Oly or PL failed.")
			
		oneline = ""
		if MEAS == METRIC:			# Lowercase 'p' for Oly
			PLATE_ABBR = 'p'
		elif MEAS == IMPERIAL:		# Uppercase 'P' for PL
			PLATE_ABBR = 'P'
		
		rTotal = float(weight)
		if (DBG): Dbg('rtotal', rTotal)
		
		# Reject input that is not divisible by the plates we're using
		if rTotal % (smallest_plate*2) != 0: 
			oneline += "Skipping:", weight, MEAS, "due to not being divisible by the plates we're using"
		
		if compact:
			if i != 0:		# UNDO - was "if 1 != 0:"
				oneline += ''.join(["Set #", `i`, " = ", `intround(rTotal)`, MEAS, '\n'])
			else:
				oneline += ''.join(["Current set", " = ", `intround(rTotal)`, MEAS, '\n'])
		
		# Weight is the weight on each side of the bar and 
		# gets subtracted after the amount of each plate is calculated
		weight = (rTotal-BAR)/2.0
		if (DBG): Dbg('weight', weight)
		
		# ONLY HALF THE WEIGHT IS CONSIDERED AFTER THIS POINT!!!
		
		# Do integer arithmetic to calculate number of plates
		plates  = int(weight) / PLATE
		
		if plates != 0:
			#mystr = ''.join([str(plates), PLATE_ABBR])
			strplates = str(plates)
			if plates == 1: 
				strplates = ""
			oneline += ''.join([strplates, PLATE_ABBR, ', '])

		# Subtract highest plates
		weight -= plates*PLATE
		#print weight, MEAS, "on each side (not incl plates)"
		
		# Go through plates_arr and calculate how many of each plate necessary
		for j in range( 0, len(plates_arr) ):	# skip first plate for now
			curr_num = int(weight / plates_arr[j])

			if curr_num != 0:
				weight -= curr_num * plates_arr[j]
			
				if curr_num != 1:
					oneline = ''.join([oneline, `curr_num`, "x", `plates_arr[j]`, ", "])
				else: 	# Shorten plates str if there's only 1 quantity of the plate
					oneline = ''.join([oneline, `plates_arr[j]`, ", "])

		oneline = oneline[:-2]		# Remove trailing comma and one whitespace
		
		# Some string formatting stuff
		#if oneline[0] = ","
		return oneline

		
# Set program to olympic lifting or power lifting
# Returns -1 if there is an error
def set_program(prog):
	global plates_arr, BAR, PLATE, MEAS, smallest_plate

	if prog == METRIC:
		BAR = OLY_BAR
		PLATE = OLY_PLATE
		MEAS = METRIC
		plates_arr = oly_plates
	elif prog == IMPERIAL:
		BAR = PL_BAR
		PLATE = PL_PLATE
		MEAS = IMPERIAL
		plates_arr = pl_plates	
	else:
		if (DBG): Dbg('plates.py - set_program(prog) failed. prog', prog)
		return -1;
		
	smallest_plate = plates_arr[ len(plates_arr) - 1 ]
	
# Check arguments to decide whether to set to oly or pl lifts
def check_args():
	if len(sys.argv) < 2 or sys.argv[1] == "-h": 	# No args => print usage
		print "Plates Calculator by Boris Joffe (Copyright 2011-2012)\n\
Usage:\t./plates [space separated list of weights] [either 'kg' or 'lbs']\n\
\t./plates --auto\t\tRead next workout automatically from main file";
		sys.exit();

	if sys.argv[1] == '--auto' or sys.argv[1] == '-a':

		weight_regexp = '(?<=:)\d+';
		plates_list = [];
		my_workout = workoutlog.get_next_workout();

		if my_workout == -1:
			workout_date = workoutlog.get_workout_date( my_workout[0] )

			print "No weights found for your next workout on", workout_date + ".\n\nIt looks like you began writing your workout but have not added any weights for your exercises. \nPlease add some weights for each exercise such as this example: \n\tsquat\t1x5:405\nThis means one set of five reps of squats at a weight of 405.\nOnce we see this, we will calculate what plates to load for each weight.\nThanks!" 
		elif my_workout == -2:
			print "Sorry, no workouts found in the beginning of", workoutlog.main_file, "within the next", workoutlog.max_future_days, "days\nPlease update your workout file and try again"
		else:
			firstline = my_workout[0];
			workout_date = workoutlog.get_workout_date( firstline  )

			# TODO - change !=-1 to something better like have an is error function
			if workout_date != -1: # if the date on the line is in the next few days
				print "==== NEXT WORKOUT on", workout_date, "====";
				workout_meas = check_sys(firstline); # get lbs or kg for system 

				weights = [];
				for j in range(1, len(my_workout)): # every line of workout, line 0 is the date so skip it
					nextline = my_workout[j]
					if DBG: Dbg('nextline', nextline);

					if j == 1 and nextline == '\n': 	# If the line immediately after the date is blank
						print "No sets or weights found for your next workout on", workout_date + ".\n\nIt looks like you began writing your workout but haven't added any exercises yet. \nPlease add some exercises with corresponding weights such as: \n\tsquat\t1x5:405\nThis means one set of five reps of squats at a weight of 405.\nOnce we see this, we will calculate what plates to load for each weight.\nThanks!";
						return -1
					else:
						if j != 1 and weights:
							plates_list.append('\n' + BREAK_STR + '\n'); # add break before every workout exercise except the 1st one if workout weights were found

						weights = [];
						sets = string.split(nextline, ',');  #TODO - remove comments on each line
						for set in sets: 	# build weight[] of all sets
							if DBG: Dbg('Searching for weight set',set);
							m = re.search(weight_regexp, set);
							if m:
								weights.append(m.group());
						
						if weights:		# if weights were found on the line
							if DBG: Dbg('weight[]',weights);
							plates_list.append(calcplatearr(weights, 1, True, workout_meas));	# add plates calculation for the current line

						elif not weights:
							print "No sets or weights found for your next workout on", workout_date + ".\n\nIt looks like you began writing your workout but haven't added any exercises yet. \nPlease add some exercises with corresponding weights such as: \n\tsquat\t1x5:405\nThis means one set of five reps of squats at a weight of 405.\nOnce we see this, we will calculate what plates to load for each weight.\nThanks!";
							return -1

		if plates_list:
			print ''.join(plates_list);

		return 0; # for --auto option

	# Last arg is lbs or kg
	lastarg = sys.argv[len(sys.argv)-1]
	if check_sys(lastarg, True) == -1: # return error if no valid lastarg
		NO_MEAS_SPECIFIED = True;

	if set_program( check_sys(string.lower(lastarg), True) ) == -1:
		Err("'plates.py' - Please specify last argument to be 'lbs' or 'kg'.")
		lastarg = DEFAULT_MEAS
		
# Round num to round_to - DEPRECATED
def my_round(round_to, num):
	return round_to * round(float(num)/round_to)
	
# Round to twice the smallest plate - DEPRECATED
def round_small(num):
	return my_round(smallest_plate*2, num)
	
# Round to the smallest plate - DEPRECATED
def round_small2(num):
	return my_round(smallest_plate, num)	
	
# Is an integer?
def is_int(num):
	return int(num)==num
	
# Truncate decimal if is_int
def intround(num):
	if is_int(num): return int(num)
	else: return num

# If this is being run from a commandline directly, execute main
if __name__ == "__main__":
	check_args()
	main()
