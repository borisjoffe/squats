SRC=$(CURDIR)
TEMPLATE_DIR=$(SRC)/templates
PUB_DIR=$(SRC)/pub
SCRIPT_DIR=$(PUB_DIR)

all: jade coffee

# Programs and flags
JADE=jade
JADE_ARGS=--pretty $(FLAGS)
COFFEE=coffee
COFFEE_ARGS=--compile $(FLAGS) --join app.js --output $(PUB_DIR)/
FLAGS=

jade: $(TEMPLATE_DIR)/*.jade
	$(JADE) $(JADE_ARGS) $^

coffee: $(SCRIPT_DIR)/*.coffee
	$(COFFEE) $(COFFEE_ARGS) $^

watch: jade coffee

clean:
	rm $(TEMPLATE_DIR)/*.html

.PHONY: clean
