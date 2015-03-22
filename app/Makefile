SRC=$(CURDIR)
TEMPLATE_DIR=$(SRC)/templates
PUB_DIR=$(SRC)/pub
SCRIPT_DIR=$(PUB_DIR)
STYLES_DIR=$(PUB_DIR)

all: babel stylus jade

# Programs and flags
JADE=jade
JADE_ARGS=--pretty $(FLAGS)
COFFEE=coffee
COFFEE_ARGS=--compile $(FLAGS) --join app.js --output $(PUB_DIR)/
BABEL=babel
BABEL_ARGS=--modules common $(FLAGS) --out-file $(PUB_DIR)/app.js
STYLUS=stylus
STYLUS_ARGS=$(FLAGS)
FLAGS=

jade: $(TEMPLATE_DIR)/*.jade
	$(JADE) $(JADE_ARGS) $^

coffee: $(SCRIPT_DIR)/*.coffee
	$(COFFEE) $(COFFEE_ARGS) $^

babel: $(SCRIPT_DIR)/*.es6
	$(BABEL) $(BABEL_ARGS) $^

stylus: $(STYLES_DIR)/*.styl
	$(STYLUS) $(STYLUS_ARGS) $^

watch: babel stylus jade

clean:
	rm $(TEMPLATE_DIR)/*.html

.PHONY: clean
