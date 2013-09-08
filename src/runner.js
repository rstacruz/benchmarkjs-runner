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
    mySuite.afterEach = [];

    Data.suites.push(mySuite);
    Data.current.suite = mySuite;

    fn(); /* yield */

    each(mySuite.afterEach, function(fn) {
      each(mySuite, function(bench) {
        bench.on('cycle', fn);
      });
    });
  };

  /**
   * For things to run before an entire suite
   */

  window.before = function(fn) {
    if (!Data.current.suite) throw new Error("No suite");
    var suite = Data.current.suite;

    suite.on('start', fn);
  };

  /**
   * For things to run after an entire suite
   */

  window.after = function(fn) {
    if (!Data.current.suite) throw new Error("No suite");
    var suite = Data.current.suite;

    suite.on('complete', fn);
  };

  /**
   * Something to do after each.
   */

  window.afterEach = function(fn) {
    if (!Data.current.suite) throw new Error("No suite");
    var suite = Data.current.suite;

    suite.afterEach.push(fn);
  };

  /**
   * Starts a new benchmark inside a suite.
   */

  window.benchmark = window.bench = function(name, fn, options) {
    if (!Data.current.suite) throw new Error("No suite");
    var suite = Data.current.suite;

    var bench = suite.add(name, fn, options);
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
        ".b-header { margin-bottom: 10px; }" +
        ".b-header h2 { font-size: 1.2em; font-weight: 200; display: inline-block; margin-right: 15px; }" +
        ".b-header button { margin: 0; padding: 0; outline: 0; background: transparent; border: 0; }" +
        ".b-header button { padding: 2px 10px; border: solid 1px #eee; border-radius: 2px; }" +
        ".b-header button:hover { background: #1bd; border-color: #1bd; color: white; }" +
        ".b-header button.disabled { background: white; border-color: #e0e0e0; color: #bbb; cursor: not-allowed; pointer-events: none; -webkit-pointer-events: none; opacity: 0.2; }" +
        ".b-bench-status { margin-right: 15px; color: #1bd; font-size: 0.7em; display: none; }" +
        ".b-bench h3 { display: inline-block; margin-right: 15px; font-size: 0.9em; }" +
        ".b-progress { display: inline-block; width: 50px; height: 4px; border: solid 1px #ddd; position: relative; border-radius: 2px; margin-right: 10px; padding: 1px; }" +
        ".b-progress-bar { width: 0; background: #ccc; height: 100%; }";

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
          "<div class='b-progress'><div class='b-progress-bar'></div></div>" +
          "<h3>" + data.name + "</h3>" +
          "<span class='b-bench-status'></span>" +
        "</div>";
    }
  };

  // ----------------------------------------------------------------------------
  // View stuff

  $(function() {
    $("<style>").text(Tpl.style()).appendTo("head");

    each(Data.suites, function(suite) {
      // Create DOM for suite
      var $suite = $(Tpl.suite(suite)).appendTo('body');

      var timer;

      // Create DOM for benchmarks
      each(suite, function(bench) {
        var $bench = $(Tpl.bench(bench)).appendTo($suite.find('.b-benchmarks'));
      });

      // Bind DOM -> model events
      $suite.find('.b-run').on('click', function() {
        suite.reset();
        suite.run({ async: true });
      });

      // Bind model -> DOM events
      suite
        .on('start', function() {
          $suite.find('.b-run').addClass('disabled');
        })

        .on('complete', function() {
          $suite.find('.b-run').removeClass('disabled');
          updateSuite(suite, $suite);
        });

      each(suite, function(bench) {
        bench.on('start cycle complete', function() {
          updateSuite(suite, $suite);
        });
      });
    });

  });

  function updateSuite(suite, $suite) {
    each(suite, function(bench, i) {
      var $bench = $suite.find('.b-bench').eq(i);

      updateBench(suite, bench, $bench);
    });
  }

  function updateBench(suite, bench, $bench) {
    var fastest = suite.filter('fastest').pluck('hz')[0];

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

    if (!suite.running) {
      var percent = bench.hz / fastest;
      $bench.find('.b-progress-bar').css({ width: percent*100 + "%" });
    }

    $bench
      .find('.b-bench-status').show().html(str).end();
  }

  /**
   * Helper for each
   */

  function each(list, fn) {
    var len = list.length;
    for (var i=0; i<len; ++i) { fn(list[i], i); }
  }

})(jQuery);
