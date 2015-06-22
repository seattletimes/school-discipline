//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

require("angular");
var $ = require("jquery");

var app = angular.module("discipline-app", []);

app.filter("na", function() {
  return function(value) {
    return value === false ? "N/A" : value;
  }
});

app.controller("discipline-controller", ["$scope", "$filter", function($scope, $filter) {

  var ngNumber = $filter("number");

  var all = window.discipline.filter(function(row) {
    if (true) return true;
    //line beneath filters for null rows, suppress right now for transparency
    return "asian_d,black_d,hispanic_d,multi_d,li_d".split(",").some((k) => row[k]);
  });

  all.forEach(function(item) {
    "asian,black,hispanic,multi,li,white".split(",").forEach(function(demo) {
      item[`${demo}_d`] = (item[`${demo}_d`] * 1) || false;
      item[`${demo}_pop`] = (item[`${demo}_pop`] * 1) || 0;
      var rate = item[`${demo}_d`] / item[`${demo}_pop`];
      item[`${demo}_rate`] = (rate * 100) || false;
    });
    item.d_rate = item.disciplined / item.population;
  });

  $scope.search = "";
  $scope.mode = "numbers";
  $scope.comparison = "white";
  $scope.data = all;

  $scope.getRate = function(row, column) {
    var value = row[`${column}_rate`];
    if (!value) return "";
    return value;
  };

  $scope.getDiscipline = function(row, column) {
    var value = row[`${column}_d`];
    if (!value) return "";
    return value;
  };

  $scope.getRelative = function(item, demo) {
    var rate = item[`${demo}_rate`];
    var compared = item[`${$scope.comparison}_rate`];
    if (!rate || !compared) return "";
    var ratio = rate / compared;
    return ratio.toFixed(1);
  };

}]);

app.directive("debounceModel", function() {
  var debounce = function(f, delay) {
    var timeout = null;
    return function() {
      if (timeout) return;
      setTimeout(function() {
        timeout = null;
        f();
      }, delay || 200);
    };
  }

  return {
    restrict: "A",
    scope: {
      "model": "=debounceModel"
    },
    link: function(scope, element, attrs) {
      scope.$watch("model", function(now) {
        if (now == current) return;
        element.val(now);
      });

      scope.model = element.val();
      var current = scope.model;

      element.on("keyup", debounce(function() {
        current = scope.model = element.val();
        scope.$apply();
      }));
    }
  }
})