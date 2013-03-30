#!/usr/bin/python
# -*- coding: utf-8 -*-

# General Utility functions for the Squats and Deads program
# Copyright 2011 Boris Joffe

# TODO 
# * add filename in error msg

import sys, string
DBG = False

METRIC = "kg"
IMPERIAL = "lbs"
DEFAULT_MEAS = IMPERIAL

# Check whether string input by user means that he wants oly style or pl style lifts
# If none specified, return default
# If none specified AND ReturnError=True, return -1
def check_sys(desc, ReturnError=False):
    desc = string.lower(desc)
    if string.find(desc, "oly") != -1 or string.find(desc, "kg") != -1 or string.find(desc, "kgs") != -1: 
        return METRIC
    elif string.find(desc, "pl") != -1 or string.find(desc, "lb") != -1 or string.find(desc, "lbs") != -1: 
        return IMPERIAL
    else:
        if DBG: Dbg("plates.py/check_sys() - Could not check if you wanted to use the Oly or PL system. You specified", desc) # delete this???
        if ReturnError:
            if DBG: Dbg("plates.py/check_sys() cont'd - returned error", ReturnError)
            return -1
        else:
            if DBG: Dbg("plates.py/check_sys() cont'd - Using DEFAULT MEAS", DEFAULT_MEAS)
            return DEFAULT_MEAS


# Prints error message in a standard format	
def Err(msg):
	print "Error:", msg
	
# Prints Fatal Error message in a standard format
def ErrF(msg):
	print "Fatal Error:", msg
	sys.exit()

# Prints name and val of the object you want to debug in a standard format
def Dbg(name, val):
	#if DEBUG: 		# DOES THIS ACTUALLY WORK?
	print "--> DBG: ", name, "=", val
