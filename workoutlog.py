#!/usr/bin/python

import sys, os, re, datetime, types, string
from utils import Err, ErrF, Dbg, check_sys


DBG = False;
Verbose = True;

METRIC = "kg"
IMPERIAL = "lbs"
DEFAULT_MEAS = IMPERIAL

dir = '/home/boris/fitness';
filename = 'sl5x5.txt';
main_file = os.path.join(dir, filename);

date_regexp = '\d{4}/\d{2}/\d{2}';
max_read_lines = 250; max_lines_workout = 50; max_future_days = 2;
next_days = []; workout = []; workout_meas = DEFAULT_MEAS;

# Create list of next days from today (inclusive) to max_future_days ahead
# Format of day is YYYY/MM/DD
# e.g. if max_future_days = 2, it will return today and tomorrow
def make_list_of_next_days(max_future_days=max_future_days):
	year_month = datetime.date.today().strftime('%Y/%m/');
	day_of_month = int(datetime.date.today().strftime('%d')); # TODO - fix BUG - won't work at month boundaries

	for i in range(max_future_days): # make array of next few dates (formatted)
		next_days.append(year_month + str(day_of_month + i).zfill(2)); # use zfill to keep leading zero
	return next_days;

# Get workout date from first line of workout
def get_workout_date(firstline):
	line_has_date = re.search(date_regexp, firstline);

	if line_has_date:
		return line_has_date.group();
	else:
		return -1;

# Returns next workout from filename
# NOTE - removes double tabs (for pretty printing) if Verbose
def get_next_workout(filename=main_file, Verbose=False):
	if not filename:
		filename = main_file
	f = open(filename, 'r');
	i = j = 0; found = False;
	workout = []; 
	next_days = make_list_of_next_days(max_future_days);

	while i < max_read_lines and not found:
		line = f.readline();
		workout_date = get_workout_date(line);	

		if workout_date != -1 and workout_date in next_days: # if the date on the line is in the next few days
			found = True; # found date workout header that is coming up in the next few days
			workout_meas = check_sys(line); # get lbs or kg for system 
			workout.append(line);

			for j in range(max_lines_workout): # every line of workout
				nextline = f.readline();
				if j == 0 and string.replace(nextline, '\t', '') == '\n':
					if Verbose: print "'workoutlog.py' - No sets or weights found for your next workout on", workout_date + ".\n\nIt looks like you began writing your workout but haven't added any exercises yet. \nPlease add some exercises with corresponding weights such as: \n\tsquat\t1x5:405\nThis means one set of five reps of squats at a weight of 405.\nOnce we see this, we will calculate what plates to load for each weight.\nThanks!";
					if DBG:
						Dbg('nextline was newline', nextline)
					f.close()
					return -1
				if nextline == '\n':
					break;
				else:
					if Verbose: nextline = re.sub('\t\t', '\t', nextline)
					workout.append(nextline)
		i += 1;

	f.close()

	if not workout and not found: # couldn't find workout at all (no date and no workout sets)
		if Verbose: print "'workoutlog.py' - Sorry, no workouts found in the beginning of", os.path.join(dir, filename), "within the next", max_future_days, "days\nPlease update your workout file and try again"
		return -2;

	return workout

		
def main():
	arglen = len(sys.argv)

	next_workout = get_next_workout(os.path.join(dir, filename), True);
	if not type(next_workout) is types.IntType: # if an int error code wasn't returned
		print ''.join(next_workout)
		return 0;
	else:
		return next_workout;


# If this is being run from a commandline directly, execute main
if __name__ == "__main__":
	sys.exit(main())
