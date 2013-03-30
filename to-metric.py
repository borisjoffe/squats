#!/usr/bin/python

import sys

KG_IN_LBS = 2.2046
LB_IN_KG = 0.4536

# Round to nearest 5
def round5(x):
	return int(5 * round(float(x)/5.0))

# Round to nearest 2 decimal places
def round2d(x):
	return 0.01 * round(float(x)/0.01)

lastarg = sys.argv[ len(sys.argv)-1 ]
if  lastarg == "tokg" or lastarg == "tokgs" or lastarg == "to kg":
	# Go through args and convert to kgs
	for i in range(1,len(sys.argv)-1):
		weight = round5(float(sys.argv[i]) * LB_IN_KG)
		print "rounded = ", str( weight ), "kg, in lbs = ", str( round2d(weight * KG_IN_LBS) ), "lbs"
elif lastarg == "tolb" or lastarg == "tolbs" or lastarg == "topounds" or lastarg == "to lb" or lastarg == "to lbs":
	# Go through args and convert to lbs
	for i in range(1,len(sys.argv)-1):
		weight = round5(float(sys.argv[i]) / LB_IN_KG)
		print "rounded = ", str( weight ), "lbs, in kg = ", str( round2d(weight / KG_IN_LBS) ), "kg"
else:
	print "Error: Wrong last arg. Please specify 'tokg' or 'tolb'"