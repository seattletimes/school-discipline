//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

require("angular");
var app = require("./application");
require("./typeSelect");
require("./ratioChart");
require("./pie");

var all = window.discipline.filter(d => d.code != "wa");
var total = window.discipline.filter(d => d.code == "wa").pop();

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
demographics.forEach(d => {
  labels[d.data] = d.alt || d.label;
});

all.forEach(function(row) {
  byCode[row.code] = row;
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
    var available = d => !d.exclude && district[`${d.data}_d`] && district[`${d.data}_d`] !== "N/A";
    $scope.exclusive = demographics.filter(available);
    $scope.relativeRates = $scope.exclusive.filter(d => d.data != base);
    
    var bases = $scope.exclusive.map(d => d.data);
    
    if (bases.indexOf($scope.baseline) < 0) {
      $scope.baseline = bases.shift();
    }

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

