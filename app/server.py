#!/usr/bin/env python

import sys
import json
from hashlib import sha512
# from future import *

from flask import Flask, Blueprint, render_template, session, Response
# from flask import url_for, request, redirect, g
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
	hashcode = sha512(data.encode('utf-8')).hexdigest()
	# figure out how to return json
	return Response(json.dumps({ "workouts": data, "hashcode": hashcode }), mimetype='text/json')

# ==== Helpers ====

def is_logged_in(session) -> int:
	return True

# ==== HTML API ====

@app.route('/')
def index():
	if is_logged_in(session):
		return render_template('index.html')
	else:
		return "ERROR: NOT LOGGED IN"

# Static server - move to nginx
@app.route('/pub/<staticFile>')
def pub_resource(staticFile):
	f = pub.open_resource('pub/' + staticFile)
	content = f.read()
	f.close()
	mimetype = 'text/' + staticFile.split('.')[-1]
	resp = Response(content, mimetype=mimetype)
	return resp

def main():
	app.run()
	return 0

if __name__ == "__main__":
    sys.exit(main())
