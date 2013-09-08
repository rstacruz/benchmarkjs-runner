# Benchmark.js runner

Easy way to create performance tests for browser JS performance using 
[Benchmark.js]. Think of it like an easy-to-use version of [jsperf.com].
**[(Demo)](http://rstacruz.github.io/benchmarkjs-runner/example.html)**

![Screenshot](http://rstacruz.github.io/benchmarkjs-runner/support/screenshot.png)

## Usage

Simply create a plain HTML file that includes the `benchmark-runner` script,
like below. Also see [example.html](example.html) for more detailed
examples.

~~~ html
<!DOCTYPE html>
<meta charset='utf-8' />
<title>Benchmarks</title>
<script src='http://rstacruz.github.io/benchmarkjs-runner/runner.js'></script>
<script>

  suite("String matching", function() {
    bench("String#indexOf", function() {
      "Hello world".indexOf('o') > -1;
    });

    bench("String#match", function() {
      !! "Hello world".match(/o/);
    });

    bench("RegExp#test", function() {
      !! /o/.test("Hello world");
    });
  });

</script>
~~~


## Acknowledgements

© 2013, Rico Sta. Cruz. Released under the [MIT License].

[MIT License]: http://www.opensource.org/licenses/mit-license.php
[jsperf.com]: http://jsperf.com/
[benchmark.js]: http://benchmarkjs.com/
