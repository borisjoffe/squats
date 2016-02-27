SRC=$(CURDIR)
TEMPLATE_DIR=$(SRC)/templates
PUB_DIR=$(SRC)/pub
SCRIPT_DIR=$(PUB_DIR)
#SCRIPT_FILES=config.js util.js storage.js workout.js parser.js program-generator.js workout-components.js program-editor.js app.js
COMPILED_JS_FILES=$(filter-out $(SCRIPT_DIR)/bundle.js, $(wildcard $(SCRIPT_DIR)/*.js))
APP_JS=app.js
STYLES_DIR=$(PUB_DIR)

all: js css html
#js: babel jsx
js: webpack

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
WEBPACK_ARGS=--colors --progress --display-error-details --display-origins --labeled-modules --display-cached $(FLAGS)
WEBPACK_DEBUG_ARGS=--colors --progress --debug --display-error-details -v --display-origins --display-modules --display-cached --labeled-modules $(FLAGS)
FLAGS=

html: $(TEMPLATE_DIR)/*.jade
	$(JADE) $(JADE_ARGS) $^

# TODO: Replace with webpack loaders
babel: $(SCRIPT_DIR)/*[^bundle].js
	#$(BABEL) $(BABEL_ARGS) $^
	cd $(PUB_DIR); \
	$(BABEL) $(BABEL_ARGS) $(SCRIPT_FILES)

jsx: $(SCRIPT_DIR)/app.js
	$(JSX) $(JSX_ARGS) $(PUB_DIR) $(PUB_DIR)

css: $(STYLES_DIR)/*.styl
	$(STYLUS) $(STYLUS_ARGS) $^

webpack: $(SCRIPT_DIR)/*[^bundle].js
	$(WEBPACK) $(WEBPACK_ARGS)

#watch: babel jsx css html
watch:
	make FLAGS=--watch webpack

serve:
	python server.py

cleanjs:
	rm $(PUB_DIR)/$(APP_JS); \
	rm $(COMPILED_JS_FILES); \
	rm $(SCRIPT_DIR)/*.map

cleanother:
	rm $(TEMPLATE_DIR)/*.html; \
	rm $(STYLES_DIR)/*.css

clean: cleanjs cleanother

.PHONY: clean webpack watch
