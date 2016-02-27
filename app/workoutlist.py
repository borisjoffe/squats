#!/usr/bin/python

# import sys

class WorkoutList():
	filename = "/home/boris/fitness/sl5x5.txt"

	def __init__(self, uid):
		pass
		#self.workouts = []

	def take(self, n = 50):
		f = open(self.filename, 'r')
		lines = f.read()
		f.close()

		workouts = lines.split('\n\n')

		return workouts[1:n]
