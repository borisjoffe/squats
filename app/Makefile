SRC=$(CURDIR)
TEMPLATE_DIR=$(SRC)/templates
PUB_DIR=$(SRC)/pub
SCRIPT_DIR=$(PUB_DIR)
STYLES_DIR=$(PUB_DIR)

all: coffee stylus jade

# Programs and flags
JADE=jade
JADE_ARGS=--pretty $(FLAGS)
COFFEE=coffee
COFFEE_ARGS=--compile $(FLAGS) --join app.js --output $(PUB_DIR)/
STYLUS=stylus
STYLUS_ARGS=$(FLAGS)
FLAGS=

jade: $(TEMPLATE_DIR)/*.jade
	$(JADE) $(JADE_ARGS) $^

coffee: $(SCRIPT_DIR)/*.coffee
	$(COFFEE) $(COFFEE_ARGS) $^

stylus: $(STYLES_DIR)/*.styl
	$(STYLUS) $(STYLUS_ARGS) $^

watch: coffee stylus jade

clean:
	rm $(TEMPLATE_DIR)/*.html

.PHONY: clean
