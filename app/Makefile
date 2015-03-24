SRC=$(CURDIR)
TEMPLATE_DIR=$(SRC)/templates
PUB_DIR=$(SRC)/pub
SCRIPT_DIR=$(PUB_DIR)
SCRIPT_FILES=config.es6 workout.es6 program-generator.es6 app.es6
APP_JS=app.js
STYLES_DIR=$(PUB_DIR)

all: js stylus jade
js: babel jsx

# Programs and flags
JADE=jade
JADE_ARGS=--pretty $(FLAGS)
COFFEE=coffee
COFFEE_ARGS=--compile $(FLAGS) --join $(APP_JS) --output $(PUB_DIR)/
BABEL=babel
BABEL_ARGS=--modules common --experimental $(FLAGS) --out-file $(PUB_DIR)/$(APP_JS)
# --source-maps
JSX=jsx
JSX_ARGS=$(FLAGS)
STYLUS=stylus
STYLUS_ARGS=$(FLAGS)
FLAGS=

jade: $(TEMPLATE_DIR)/*.jade
	$(JADE) $(JADE_ARGS) $^

coffee: $(SCRIPT_DIR)/*.coffee
	$(COFFEE) $(COFFEE_ARGS) $^

# TODO: Replace with webpack loaders
babel: $(SCRIPT_DIR)/*.es6
	#$(BABEL) $(BABEL_ARGS) $^
	cd $(PUB_DIR); \
	$(BABEL) $(BABEL_ARGS) $(SCRIPT_FILES)

jsx: $(SCRIPT_DIR)/app.js
	$(JSX) $(JSX_ARGS) $(PUB_DIR) $(PUB_DIR)

stylus: $(STYLES_DIR)/*.styl
	$(STYLUS) $(STYLUS_ARGS) $^

watch: babel jsx stylus jade

clean:
	rm $(TEMPLATE_DIR)/*.html
	rm $(PUB_DIR)/$(APP_JS)
	rm $(STYLES_DIR)/*.css

.PHONY: clean
