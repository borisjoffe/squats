#!/usr/bin/env python

import sys
import string
#from future import *

from flask import Flask, render_template, url_for, request, redirect, session, g
app = Flask(__name__)

app.debug = True
if app.debug:
	import pdb

from workoutlist import WorkoutList

# ==== REST API ====
@app.route('/workouts', methods=['GET'])
def workouts():
	workoutlist = WorkoutList(0)
	return '\n'.join(workoutlist.take(50))

# ==== Helpers ====

def logged_in(session):
	return True

# ==== HTML API ====

@app.route('/')
def index():
	if logged_in(session):
		return render_template('index.html')
	else:
		return "ERROR: NOT LOGGED IN"

def f(filename):
	f = open(filename, 'r')
	x = f.read()
	f.close()
	return x

# Static stuff - move to nginx
@app.route('/lib/jquery.min.js')
def js1(): return f('pub/lib/jquery.min.js')

@app.route('/app.js')
def js2(): return f('pub/app.js')

@app.route('/main.css')
def css(): return f('pub/main.css')

def main():
	app.run()
	return 0

if __name__ == "__main__":
    sys.exit(main())
