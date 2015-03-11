SRC=$(CURDIR)
TEMPLATE_DIR=$(SRC)/templates
SCRIPT_DIR=$(SRC)/js

all: jade coffee

# Programs and flags
FLAGS=
JADE_ARGS=-P $(FLAGS)
COFFEE_ARGS=-c $(FLAGS)

jade: $(TEMPLATE_DIR)/*.jade
	jade $(JADE_ARGS) $^

coffee: $(SCRIPT_DIR)/*.coffee
	coffee $(COFFEE_ARGS) $^

watch: jade coffee

clean:
	rm $(TEMPLATE_DIR)/*.html

.PHONY: clean
