#!/usr/bin/python

# SQUATS AND DEADS CALCULATOR VERSION 0.8.5
# Copyright 2011 Boris Joffe squatsanddeads@joff3.com

# TODO - make array of set intervals (based on day?)
# TODO - have bench cutoff

import sys
from datetime import date
import string
import math
from plates import calcplatearr, calcplates, check_sys
from utils import Err, ErrF, Dbg 

# CONSTANTS
POUNDS_IN_A_KG = 2.20462262

DEBUG = True
MIN_NUM_ARGS = 7

MADCOW = True			# Am I doing the Intermediate Madcow 5x5 Program?
MC_PCLEANS = True		# Am I doing powercleans instead of rows in madcow?
SET_INTERVAL = .15		# Percent increase between sets
DEFAULT_CLOTHES = "shorts2,converse"

IMPERIAL = "lbs"
METRIC = "kg"
MEAS = False				# Measurement system - metric or imperial

# Cutoffs in kg - weight has to be above this amount for it to be worth it to do
# Otherwise the weight gets removed by remove_very_light_weights
# I added +1 lb in the conversion to lbs implementation to make up for the int() operation
PRESSCUTOFF = 43
POWERCLEANCUTOFF = 50
ROWSCUTOFF = 45
lastsetcutoff = False

def main():	
	global MEAS, lastsetcutoff

	if len(sys.argv) < 2 or sys.argv[1] == "-h":
		print "SQUATS & DEADS Calculator by Boris (Copyright 2011)\n\
Usage: ./workout.py [OPTIONS] or python workout.py [OPTIONS]\n\
\t-h\t\tDisplays this message\n\
\t[OPTIONS]\tweight, clothes, day, worksets for first 3 exercises, units"
		return

	if len(sys.argv) < MIN_NUM_ARGS:
		ErrF("Too few args. Try putting in more....yea, put it in!")
		
	desc = string.lower( sys.argv[len(sys.argv)-1] )
	if check_sys(desc) == "kg":
		MEAS = METRIC
	elif check_sys(desc) == "lbs":
		MEAS = IMPERIAL
	else:
		ErrF("Error: 'workout.py' - Setting SYS to Oly or PL failed.")

	weight = sys.argv[1]
	clothes = sys.argv[2]
	
	if clothes == "":		# Shortcut to default clothes by putting nothing in
		clothes = DEFAULT_CLOTHES

	if weight == "0":		# Did not weigh myself
		weight = ""
		clothes = ""

	day = sys.argv[3]
	set1 = sys.argv[4]
	set2 = sys.argv[5]
	set3 = sys.argv[6]
	
	# First line has date, weight, clothes worn during weigh-in, kg or lbs, and which workout
	# Remove blank entries and separate the others with spaces
	heading = ''.join(filter(lambda x: x.strip(), [date.today().strftime('%Y/%m/%d') + ' ', weight + ' ', clothes + ' ', MEAS + ' ', "(", day + " workout", ")"])) + '\n'
	
	if MADCOW:
		# Set cutoff weight for last set
		if day == "wed":		# For PRESS
			if MEAS == METRIC: lastsetcutoff = PRESSCUTOFF
			elif MEAS == IMPERIAL: lastsetcutoff = int(PRESSCUTOFF * POUNDS_IN_A_KG + 1)
		elif day != "wed" and MC_PCLEANS: 		# For PowerCleans
			if MEAS == METRIC: lastsetcutoff = POWERCLEANCUTOFF
			elif MEAS == IMPERIAL: lastsetcutoff = int(POWERCLEANCUTOFF * POUNDS_IN_A_KG + 1)
		elif day != "wed" and not MC_PCLEANS:	# For Rows
			if MEAS == METRIC: lastsetcutoff = ROWSCUTOFF
			elif MEAS == IMPERIAL: lastsetcutoff = int(ROWSCUTOFF * POUNDS_IN_A_KG + 1)
		else: ErrF("Could not set cutoff weight for last set")
	
		if day == "mon": exercises = mc_exer_mon(set1, set2, set3)
		elif day == "wed": exercises = mc_exer_wed(set1, set2, set3)
		elif day == "fri": exercises = mc_exer_fri(set1, set2, set3)
		#elif day == "wk" or "week":
		#	exercises = mc_exer
		else: 
			ErrF("'workout.py' - Please specify a day in the correct format")
	else:
		ErrF("Workouts other than 'Madcow5x5 Intermediate' are not supported yet")

	#Output final string
	workout = heading + exercises
	
	workoutarr = filter(None, workout.splitlines())	# Split workout into lines and remove empty lines
	workoutlog = workoutarr[0] + "\n"
	for i in range(1, len(workoutarr)):
		if i % 2 == 0:
			workoutlog += workoutarr[i] + "\n"
			
	print workoutlog,  '\n', workout
	
# Calculate Madcow 5x5 Exercise for Monday Workouts
def mc_exer_mon(w1, w2, w3):
	# SQUATS
	squatsarr = [set_calc(w1,4), set_calc(w1,3), set_calc(w1,2), set_calc(w1,1), w1]
	squats = "\t\t" + calcplatearr(squatsarr, 0, False, MEAS) + '\n' + "\tsquat\t"
	# Construct squat workout for Monday
	for i in range(0, len(squatsarr)):
		squatsarr[i] = str(squatsarr[i])	# For more modularity later
		squats += "1x5:" + squatsarr[i] + ", "
	squats = squats[:-2] + "\n\n"	# Remove trailing comma
	
	# BENCH
	bencharr = [set_calc_pl(w2,4), set_calc_pl(w2,3), set_calc_pl(w2,2), set_calc_pl(w2,1), w2]
	bench = "\t\t" + calcplatearr(bencharr, 0, False, IMPERIAL) + '\n' + "\tbench\t"
	# Construct bench workout for Monday
	for i in range(0, len(bencharr)):
		bencharr[i] = str(bencharr[i])	# For more modularity later
		bench += "1x5:" + bencharr[i] + ", "
	bench = bench[:-2] + "\n\n"	# Remove trailing comma	
	
	if not MC_PCLEANS:
		rowarr = [set_calc(w3,4), set_calc(w3,3), set_calc(w3,2), set_calc(w3,1), w3]
		#remove_very_light_weights(rowarr, lastsetcutoff)
		rows = "\t\t" + calcplatearr(rowarr, 0, False, MEAS) + '\n' + "\trows\t"
		# Construct Rows workout for Monday
		for i in range(0, len(rowarr)):
			rowarr[i] = str(rowarr[i])	# For more modularity later
			rows += "1x5:" + rowarr[i] + ", "
		rows = rows[:-2] + "\n"	# Remove trailing comma
		return squats + bench + rows
	elif MC_PCLEANS:
		pcleanarr = [set_calc(w3,4), set_calc(w3,3), set_calc(w3,2), set_calc(w3,1), w3]
		#remove_very_light_weights(pcleanarr, lastsetcutoff)
		pcleans = "\t\t" + calcplatearr(pcleanarr, 0, False, MEAS) + '\n' + "\tpclean\t"
		
		# Construct pclean workout for Monday
		for i in range(0, len(pcleanarr)):
			pcleanarr[i] = str(pcleanarr[i])	# For more modularity later
			pcleans += "1x5:" + pcleanarr[i] + ", "
			
		pcleans = pcleans[:-2] + "\n"	# Remove trailing comma	
		return squats + bench + pcleans	
	else: 
		return Err('Was not able to complete Madcow Monday workout subroutine mc_exer_mon')

# Calculate Madcow 5x5 Exercise for Wednesday Workouts
def mc_exer_wed(w1, w2, w3):
	# SQUATS
	squatsarr = [set_calc(w1,2), set_calc(w1,1), w1]
	squats = "\t\t" + calcplatearr(squatsarr, 0, False, MEAS) + '\n' + "\tsquat\t"
	# Construct squat workout for Wednesday
	for i in range(0, len(squatsarr)):
		squatsarr[i] = str(squatsarr[i])	# For more modularity later
		if i==2:
			squats += "2x5:" + squatsarr[i] + ", "
		else:
			squats += "1x5:" + squatsarr[i] + ", "
	squats = squats[:-2] + "\n\n"	# Remove trailing comma
	
	# PRESS
	pressarr = [set_calc(w2,3), set_calc(w2,2), set_calc(w2,1), w2]
	remove_very_light_weights(pressarr, lastsetcutoff)
	press = "\t\t" + calcplatearr(pressarr, 0, False, MEAS) + '\n' + "\tpress\t"
	# Construct press workout for Wednesday
	for i in range(0, len(pressarr)):
		pressarr[i] = str(pressarr[i])	# For more modularity later
		press += "1x5:" + pressarr[i] + ", "
	press = press[:-2] + "\n\n"	# Remove trailing comma
	
	
	# DEADLIFT
	deadsarr = [set_calc(w3,3), set_calc(w3,2), set_calc(w3,1), w3]
	deads = "\t\t" + calcplatearr(deadsarr, 0, False, MEAS) + '\n' + "\tdead/l\t"
	# Construct deads workout for Wednesday
	for i in range(0, len(deadsarr)):
		deadsarr[i] = str(deadsarr[i])	# For more modularity later
		deads += "1x5:" + deadsarr[i] + ", "
	deads = deads[:-2] + "\n"	# Remove trailing comma
	
	return squats + press + deads

# Calculate Madcow 5x5 Exercise for Friday Workouts
def mc_exer_fri(w1, w2, w3):
	# SQUATS
	squatsarr = [set_calc(w1,4), set_calc(w1,3), set_calc(w1,2), set_calc(w1,1), w1, set_calc(w1,2)]
	squats = "\t\t" + calcplatearr(squatsarr[:-1], 0, False, MEAS) + '\n' + "\tsquat\t"
	# Construct squat workout for Friday
	for i in range(0, len(squatsarr)):
		squatsarr[i] = str(squatsarr[i])	# For more modularity later
		if i == 4:		# Work set
			squats += "1x3:" + squatsarr[i] + ", "
		elif i == 5:	# Drop set
			squats += "1x8:" + squatsarr[i] + ", "
		else:			# Normal set
			squats += "1x5:" + squatsarr[i] + ", "
	squats = squats[:-2] + "\n\n"	# Remove trailing comma
	
	# BENCH
	bencharr = [set_calc_pl(w2,4), set_calc_pl(w2,3), set_calc_pl(w2,2), set_calc_pl(w2,1), w2, set_calc_pl(w2,2)]
	bench = "\t\t" + calcplatearr(bencharr[:-1], 0, False, IMPERIAL) + '\n' + "\tbench\t"
	# Construct Bench workout for Friday
	for i in range(0, len(bencharr)):
		bencharr[i] = str(bencharr[i])	# For more modularity later
		if i == 4:		# Work set
			bench += "1x3:" + bencharr[i] + ", "
		elif i == 5:	# Drop set
			bench += "1x8:" + bencharr[i] + ", "
		else:			# Normal set
			bench += "1x5:" + bencharr[i] + ", "
	bench = bench[:-2] + "\n\n"	# Remove trailing comma
	
	if not MC_PCLEANS:
		rowarr = [set_calc(w3,4), set_calc(w3,3), set_calc(w3,2), set_calc(w3,1), w3, set_calc(w3,2)]
		offset = remove_very_light_weights(rowarr, lastsetcutoff)
		rows = "\t\t" + calcplatearr(rowarr[:-1], 0, False, MEAS) + '\n' + "\trows\t"
		# Construct Rows workout for Friday
		for i in range(0, len(rowarr)):
			rowarr[i] = str(rowarr[i])	# For more modularity later
			if i == 4 - offset:		# Work set
				rows += "1x3:" + rowarr[i] + ", "
			elif i == 5 - offset:	# Drop set
				rows += "1x8:" + rowarr[i] + ", "
			else:			# Normal set
				rows += "1x5:" + rowarr[i] + ", "
		rows = rows[:-2] + "\n"	# Remove trailing comma
		return squats + bench + rows
	elif MC_PCLEANS:
		pcleanarr = [set_calc(w3,4), set_calc(w3,3), set_calc(w3,2), set_calc(w3,1), w3, set_calc(w3,2)]
		offset = remove_very_light_weights(pcleanarr, lastsetcutoff)
		pcleans = "\t\t" + calcplatearr(pcleanarr[:-1], 0, False, MEAS) + '\n' + "\tpclean\t"
		# Construct Bench workout for Friday
		for i in range(0, len(pcleanarr)):
			pcleanarr[i] = str(pcleanarr[i])	# For more modularity later
			if i == 4 - offset:		# Work set
				pcleans += "1x3:" + pcleanarr[i] + ", "
			elif i == 5 - offset:	# Drop set
				pcleans += "1x8:" + pcleanarr[i] + ", "
			else:			# Normal set
				pcleans += "1x5:" + pcleanarr[i] + ", "
		pcleans = pcleans[:-2] + "\n\n"	# Remove trailing comma
		
		return squats + bench + pcleans + "\n \td/curl\t 2x5:add this yourself"

# Set Calculation: Calculate weights used for the set
# Uses powerlifting rounding; Useful for bench
# w = weight of set (usually warmup)
# n = number of sets away from workset (in mc5x5 for first set, n=4)
def set_calc_pl(w, n):
	return round5pl(float(w) - SET_INTERVAL * float(n) * float(w))
		
# Smart Set Calculation: Calculate weights used for the set based on MEAS
# w = weight of set (usually warmup)
# n = number of sets away from workset (in mc5x5 for first set, n=4)
def set_calc(w, n):
	return round5x(float(w) - SET_INTERVAL * float(n) * float(w))
	
# Smart Round to nearest 5 pounds but not 10 if using PL
# Checks whether you are doing oly or pl in order to make weights %10 but not %5
# Used for warmup sets to save time
def round5x(x):
	if MEAS == METRIC:		# If using oly plates, just round to nearest 5
		return round5(x)
	elif MEAS == IMPERIAL:
		return round5pl(x)
		
# Round to nearest 5 pounds but not 10
# Used for Powerlifting
def round5pl(x):
	if round5(x) % 10 == 0:	# Weight is divisible by 10 so it does NOT end in 5
		 return round5(x) - 5	# Subtract 5 to have it end in 5
	else:	# Otherwise, it ends in 5 so leave it
		return round5(x)
		
# Round to nearest 5 pounds no matter what
# Used for oly lifting
def round5(x):
	return int(5 * round(float(x)/5.0))

# Remove very light weights in array - less than or equal to cutoff
# Returns number of weights removed
def remove_very_light_weights(weightarr, cutoff):
	iarr = []
	for i in xrange(len(weightarr)):
		if float(weightarr[i]) <= cutoff:
			iarr.append(weightarr[i])		# creates a list of weights i have to remove
	
	# Removes those bitches
	for i in xrange(len(iarr)):
		weightarr.remove(iarr[i])
		
	return len(iarr)
	
# If this is being run from a commandline directly, execute main
if __name__ == "__main__":
	main()
