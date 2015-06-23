//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

require("angular");
var $ = require("jquery");
var app = require("./application");
require("./typeSelect");
require("./ratioChart");

var all = window.discipline;

var demographics = [
  { label: "White", data: "white" },
  { label: "Black", data: "black" },
  { label: "Asian", data: "asian" },
  { label: "Hispanic", data: "hispanic" },
  { label: "Multiracial", data: "multi" },
  { label: "Special Education", data: "se", exclude: true },
  { label: "Low-income", data: "li", exclude: true }
];
var labels = {};

var byCode = {};
var total = {
  district: "Washington",
  county: "statewide",
  population: 0,
  disciplined: 0,
};
demographics.forEach(d => {
  labels[d.data] = d.label;
  total[`${d.data}_pop`] = 0;
  total[`${d.data}_d`] = 0;
});

all.forEach(function(row) {
  byCode[row.code] = row;
  for (var key in row) {
    if (typeof total[key] == "number") total[key] += row[key]* 1;
  }
});
byCode.wa = total;

var controller = function($scope, $filter) {

  var ngNumber = $filter("number");

  $scope.district = "wa";
  $scope.districts = all;
  $scope.baseline = "white";
  $scope.selected = total;
  $scope.demographics = demographics;
  $scope.exclusive = demographics.filter(d => !d.exclude);

  //update selected from the district dropdown
  $scope.$watch(function() {
    var district = $scope.selected = byCode[$scope.district];
    var base = $scope.baseline;
    $scope.baseLabel = labels[base];
    $scope.relativeRates = $scope.exclusive.filter(d => d.data != base);

    var baselineRate = district[`${base}_d`] / district[`${base}_pop`];
    var average = $scope.relativeRates.reduce(function(total, demo) {
      return total + district[`${demo.data}_d`] / district[`${demo.data}_pop`];
    }, 0) / (demographics.length - 1);
    $scope.selectedIsHigher = baselineRate > average;
  });

  $scope.getRelative = function(demo) {
    var base = $scope.baseline;
    var district = $scope.selected;
    var baselineRate = district[`${base}_d`] / district[`${base}_pop`];
    var demoRate = district[`${demo}_d`] / district[`${demo}_pop`];
    return demoRate / baselineRate;
  };

  $scope.getRate = function(demo) {
    return $scope.selected[`${demo}_d`] / $scope.selected[`${demo}_pop`];
  };

  $scope.getArea = function(demo) {
    var rate = $scope.getRelative(demo);
    var d = Math.sqrt(rate / Math.PI);
    return d;
  }

};

controller.$inject = ["$scope", "$filter"];
app.controller("discipline-controller", controller);

