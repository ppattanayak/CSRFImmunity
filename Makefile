REPORTER = spec
JSHINT = ./node_modules/.bin/jshint
ISTANBUL = ./node_modules/.bin/istanbul
BASE = .

all: lint test

test:
	@NODE_ENV=test DEPLOY_ENV=test ./node_modules/.bin/mocha test/*.js \
		--require chai \
		--reporter $(REPORTER) \
		--timeout 20s
lint:
	$(JSHINT) ./dust/ ./lib/ ./test/ ./tags/

cover:
	rm -rf ./coverage && \
	$(ISTANBUL) cover ./node_modules/.bin/_mocha -- --timeout 10s -u exports -R spec ./test/*.js

coverreport:
	open ./coverage/lcov-report/index.html

.PHONY: test lint
