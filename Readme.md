# Benchmark.js runner

Easy way to create performance tests for browser JS performance using 
[benchmark.js].

## Usage

~~~ html
<!DOCTYPE html>
<meta charset='utf-8' />
<title>Benchmarks</title>
<script src='http://rstacruz.github.io/benchmark-runner/benchmark-runner.js'></script>
<script>
suite("String matching", function() {
  bench("String#indexOf", function() {
    "Hello world".indexOf('o') > -1;
  });

  bench("String#match", function() {
    "Hello world".indexOf('o') > -1;
  });
});
</script>
~~~

[benchmark.js](http://benchmarkjs.com/).
