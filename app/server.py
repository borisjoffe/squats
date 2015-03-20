#!/usr/bin/env python

import sys
import string
import json
from hashlib import sha512
#from future import *

from flask import Flask, Blueprint, render_template, url_for, request, redirect, session, g
pub = Blueprint('pub', __name__, static_folder='pub')
app = Flask(__name__)
app.register_blueprint(pub)

app.debug = True
if app.debug:
	import pdb

from workoutlist import WorkoutList

# ==== REST API ====
@app.route('/workouts', methods=['GET'])
def workouts():
	workoutlist = WorkoutList(0)
	data = '\n'.join(workoutlist.take(50))
	hashcode = sha512(data).hexdigest()
	# figure out how to return json
	return json.dumps({ "workouts": data, "hashcode": hashcode })

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

# Static server - move to nginx
@app.route('/pub/<staticFile>')
def pub_resource(staticFile):
	f = pub.open_resource('pub/' + staticFile)
	content = f.read()
	f.close()
	return content

def main():
	app.run()
	return 0

if __name__ == "__main__":
    sys.exit(main())
