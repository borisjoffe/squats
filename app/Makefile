SRC=$(CURDIR)
TEMPLATE_DIR=$(SRC)/templates
PUB_DIR=$(SRC)/pub
SCRIPT_DIR=$(PUB_DIR)
SCRIPT_FILES=config.es6 util.es6 storage.es6 workout.es6 parser.es6 program-generator.es6 workout-components.es6 program-editor.es6 app.es6
APP_JS=app.js
STYLES_DIR=$(PUB_DIR)

all: js stylus jade
js: babel jsx

# Programs and flags
JADE=jade
JADE_ARGS=--pretty $(FLAGS)
BABEL=babel
BABEL_OUTFILE_ARGS=--out-file $(PUB_DIR)/$(APP_JS)
BABEL_ARGS=--modules system --experimental $(FLAGS) $(BABEL_OUTFILE_ARGS)
BABEL_ARGS=$(FLAGS) $(BABEL_OUTFILE_ARGS)
# --source-maps
JSX=jsx
JSX_ARGS=$(FLAGS)
STYLUS=stylus
STYLUS_ARGS=$(FLAGS)
WEBPACK=webpack
WEBPACK_ARGS=--colors --progress $(FLAGS)
FLAGS=

jade: $(TEMPLATE_DIR)/*.jade
	$(JADE) $(JADE_ARGS) $^

# TODO: Replace with webpack loaders
babel: $(SCRIPT_DIR)/*.es6
	#$(BABEL) $(BABEL_ARGS) $^
	cd $(PUB_DIR); \
	$(BABEL) $(BABEL_ARGS) $(SCRIPT_FILES)

jsx: $(SCRIPT_DIR)/app.js
	$(JSX) $(JSX_ARGS) $(PUB_DIR) $(PUB_DIR)

stylus: $(STYLES_DIR)/*.styl
	$(STYLUS) $(STYLUS_ARGS) $^

webpack: $(SCRIPT_DIR)/*.es6
	$(WEBPACK) $(WEBPACK_ARGS)

#watch: babel jsx stylus jade
watch:
	make FLAGS=--watch webpack

serve:
	python server.py

clean:
	rm $(TEMPLATE_DIR)/*.html
	rm $(PUB_DIR)/$(APP_JS)
	rm $(STYLES_DIR)/*.css

.PHONY: clean webpack watch
