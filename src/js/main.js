//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

require("angular");
var $ = require("jquery");
var app = require("./application");
require("./typeSelect");
require("./ratioChart");
require("./pie");

var all = window.discipline;

var demographics = [
  { label: "White", alt: "white", data: "white" },
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
  labels[d.data] = d.alt || d.label;
  total[`${d.data}_pop`] = 0;
  total[`${d.data}_d`] = 0;
});

all.forEach(function(row) {
  byCode[row.code] = row;
  total.population += row.population;
  total.disciplined += row.disciplined;
  demographics.forEach(d => {
    if (row[`${d.data}_d`] != "N/A") {
      total[`${d.data}_d`] += row[`${d.data}_d`];
      total[`${d.data}_pop`] += row[`${d.data}_pop`];
    }
  });
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
    $scope.relativeRates = $scope.exclusive.filter(d => d.data != base && district[`${d.data}_d`] && district[`${d.data}_d`] !== "N/A");
    $scope.exclusive = demographics.filter(d => !d.exclude);

    var baselineRate = district[`${base}_d`] / district[`${base}_pop`];
    var count = $scope.relativeRates.reduce(function(total, demo) {
      var rate = district[`${demo.data}_d`] / district[`${demo.data}_pop`];
      return total + (rate > baselineRate ? 1 : 0);
    }, 0);
    $scope.selectedIsHigher = count < $scope.relativeRates.length / 2;
  });

  $scope.getRelative = function(demo) {
    var base = $scope.baseline;
    var district = $scope.selected;
    if (district[`${demo}_d`] == "N/A") return null;
    var baselineRate = district[`${base}_d`] / district[`${base}_pop`];
    var demoRate = district[`${demo}_d`] / district[`${demo}_pop`];
    return demoRate / baselineRate;
  };

  $scope.getRate = function(demo) {
    var district = $scope.selected;
    if (district[`${demo}_d`] == "N/A") return null;
    return district[`${demo}_d`] / district[`${demo}_pop`];
  };

  $scope.getArea = function(demo) {
    var rate = $scope.getRelative(demo);
    var d = Math.sqrt(rate / Math.PI);
    return d;
  };

};

controller.$inject = ["$scope", "$filter"];
app.controller("discipline-controller", controller);

var tableController = function($scope) {
  $scope.tableFilter = "white";
  $scope.demographics = demographics;
  $scope.labels = labels;

  var subset = all.filter(d => d.population > 3000);

  $scope.$watch("tableFilter", function() {
    var filter = $scope.tableFilter;
    $scope.tableData = subset.filter(d => typeof d[`${filter}_rate`] == "number").sort(function(a, b) {
      return b[`${filter}_rate`] - a[`${filter}_rate`];
    });
  });
};
tableController.inject = ["$scope"];
app.controller("table-controller", tableController);

