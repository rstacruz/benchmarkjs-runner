benchmark-runner.js: \
	vendor/jquery.js \
	vendor/benchmark.js \
	src/runner.js
	cat $^ > $@
