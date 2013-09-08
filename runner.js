(function($) {

  var Runner = window.Runner = {};

  // ----------------------------------------------------------------------------

  /**
   * JSON Data.
   */

  var Data = Runner.data = {
    suites: [],
    current: { suite: null }
  };

  /**
   * Defines a new suite.
   */

  window.suite = function(name, fn) {
    var mySuite = new Benchmark.Suite(name, fn);

    Data.suites.push(mySuite);
    Data.current.suite = mySuite;

    fn(); /* yield */
  };

  /**
   * Starts a new benchmark inside a suite.
   */

  window.benchmark = function(name, fn, options) {
    if (!Data.current.suite) throw new Error("No suite");
    var suite = Data.current.suite;

    suite.add(name, fn, options);
  };

  // ----------------------------------------------------------------------------

  /**
   * Templates
   */

  var Tpl = Runner.templates = {
    style: function() {
      return "" +
        "html { background: #fff; color: #111; margin: 40px; padding: 0; }" +
        "body { font-family: Helvetica Neue, sans-serif; font-size: 12pt; line-height: 1.5; }" +
        "button { cursor: pointer; }" +
        "h1, h2, h3 { font-weight: 200; font-size: 1em; margin: 0; padding: 0; }" +
        ".b-suite { margin-bottom: 20px; }" +
        ".b-header h2 { font-size: 1.2em; font-weight: 200; display: inline-block; margin-right: 15px; }" +
        ".b-header button { margin: 0; padding: 0; outline: 0; background: transparent; border: 0; }" +
        ".b-header button { padding: 2px 10px; border: solid 1px #eee; border-radius: 2px; }" +
        ".b-header button:hover { background: #1bd; border-color: #1bd; color: white; }" +
        ".b-header button.disabled { background: white; border-color: #e0e0e0; color: #bbb; cursor: not-allowed; pointer-events: none; -webkit-pointer-events: none; opacity: 0.2; }" +
        ".b-bench-status { margin-right: 15px; color: #1bd; font-size: 0.7em; display: none; }" +
        ".b-benchmarks { margin-left: 20px; }" +
        ".b-bench h3 { display: inline-block; margin-right: 15px; font-size: 0.9em; }";
    },

    suite: function(data) {
      return "" +
        "<div class='b-suite'>" +
          "<div class='b-header'>" +
            "<h2>" + data.name + "</h2>" +
            "<button class='b-run'>Run</button>" +
          "</div>" +
          "<div class='b-benchmarks'></div>" +
        "</div>";
    },

    bench: function(data) {
      return "" +
        "<div class='b-bench'>" +
          "<h3>" + data.name + "</h3>" +
          "<span class='b-bench-status'></span>" +
        "</div>";
    }
  };

  // ----------------------------------------------------------------------------
  // View stuff

  $(function() {
    $("<style>").text(Tpl.style()).appendTo("head");

    $.each(Data.suites, function() {
      var suite = this;

      // Create DOM for suite
      var $suite = $(Tpl.suite(suite)).appendTo('body');

      var timer;

      // Create DOM for benchmarks
      $.each(suite, function() {
        var benchmark = this;
        var $bench = $(Tpl.bench(benchmark)).appendTo($suite.find('.b-benchmarks'));
      });

      // Bind DOM -> model events
      $suite.find('.b-run').on('click', function() {
        suite.run({ async: true });
      });

      // Bind model -> DOM events
      suite
        .on('start', function() {
          $suite.find('.b-run').addClass('disabled');
        })

        .on('complete', function() {
          $suite.find('.b-run').removeClass('disabled');
        });

      $.each(suite, function(i) {
        var bench = this;
        var $bench = $suite.find('.b-bench').eq(i);
        
        bench.on('start cycle complete', function() {
          updateBench(this, $bench);
        });
      });
    });

  });

  function updateBench(bench, $bench) {
    var str = '';

    if (bench.error) {
      str = "ERROR";
      console.log(bench.error);
    }

    else if (bench.running) {
      str = 'running...';
    }

    else if (bench.count > 0) {
      str = [
        (parseInt(bench.hz, 10) + " ops/sec"),
        (bench.count + "&times;")
      ].join(" &mdash; ");
    }

    $bench
      .find('.b-bench-status').show().html(str).end();
  }

})(jQuery);
