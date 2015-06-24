/*

Build CSV into JSON and then load that structure onto the shared state object.
Will use cached data if it hasn't changed since the last run.

*/

var async = require("async");
var csv = require("csv");
var path = require("path");

module.exports = function(grunt) {

  grunt.registerTask("csv", "Convert CSV to JSON and load onto grunt.data", function() {

    grunt.task.requires("state");

    var files = grunt.file.expand("data/**/*.csv");

    grunt.data.csv = {};

    async.each(files, function(filename, c) {
      var file = grunt.file.read(filename);
      //strip out the empty lines that Excel likes to leave in.
      file = file.replace(/\r/g, "").split("\n").filter(function(line) { return line.match(/[^,]/) }).join("\n");
      var isKeyed = !!(file.split("\n").shift().match(/(^|,)key(,|$)/));
      var parsed = isKeyed ? {} : [];
      var parser = csv.parse({
        columns: true,
        auto_parse: true
      });
      parser.on("data", function(line) {
        //if "key" is a column, make this an object hash
        if (isKeyed) {
          var key = line.key;
          delete line.key;
          parsed[key] = line;
        } else {
          parsed.push(line);
        }
      });
      parser.on("finish", function() {
        console.log("Finished parsing", filename);
        var sanitized = path.basename(filename)
          .replace(".csv", "")
          .replace(/\W(\w)/g, function(_, letter) { return letter.toUpperCase() });
        console.log("Loaded onto grunt.data as", sanitized);
        grunt.data.csv[sanitized] = parsed;
        c();
      });
      parser.write(file);
      parser.end();
    }, function() {
      grunt.data.csv.discipline.sort(function(a, b) {
        if (a.district < b.district) return -1;
        if (b.district < a.district) return 1;
        return 0;
      });
      grunt.data.csv.discipline.forEach(function(district) {
        district.district = district.district.trim().replace(/\(.*\)$/, "");
        ["white", "asian", "black", "hispanic", "multi", "se", "li"].forEach(function(d) {
          var discipline = district[d + "_d"];
          if (discipline === "") {
            district[d + "_d"] = "N/A";
            district[d + "_rate"] = "N/A";
          } else {
            district[d + "_d"] *= 1;
            district[d + "_pop"] *= 1;
            district[d + "_rate"] = district[d + "_d"] / district[d + "_pop"];
          }
        });
      });      
    });
    


  });

};