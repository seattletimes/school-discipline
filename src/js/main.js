//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

var angular = require("angular");

var app = angular.module("discipline-app", []);

app.controller("discipline-controller", ["$scope", "$filter", function($scope, $filter) {

  var ngNumber = $filter("number");

  var all = window.discipline.filter(function(row) {
    return true;
    //line beneath filters for null rows, suppress right now for transparency
    return "asian_d,black_d,hispanic_d,multi_d,li_d".split(",").some((k) => row[k]);
  });

  $scope.search = "";
  $scope.mode = "numbers";
  $scope.comparison = "white";
  $scope.data = all;

  $scope.getValue = function(item, column) {
    var mode = $scope.mode;
    var cPop = item[`${column}_pop`];
    var disciplined = item[`${column}_d`];
    if (!disciplined) return "N/A";
    var rate = disciplined / cPop * 100;

    if (mode == "numbers") {
      return `${ngNumber(disciplined)} (${rate.toFixed(1)}%)`;
    } else if (mode == "relative") {
      var comparison = $scope.comparison;
      var comparePop = item[`${comparison}_pop`];
      var compareDisc = item[`${comparison}_d`];
      if (!compareDisc || !comparePop) return "N/A";

      var compareRate = compareDisc / comparePop * 100;
      var ratio = rate / compareRate;
      return `${ratio.toFixed(1)}x`;
    }
  };

}]);