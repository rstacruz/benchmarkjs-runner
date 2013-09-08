suite("Stuff", function() {
  benchmark("Date", function() {
    new Date();
  });
  benchmark("Date as integer", function() {
    +new Date();
  });
});

