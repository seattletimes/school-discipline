var app = require("./application");

app.directive("typeSelect", function() {
  return {
    template: `
<input ng-model="selection" placeholder="Search by district or county">
<div class="completion">
  <a class="default option" ng-click="model = 'wa'">Washington (statewide)</a>
  <hr>
  <div class="options">
    <a class="option" ng-repeat="option in filtered" ng-click="setValue(option)">
      {{option.district}} ({{option.county}})
    </a>
  </div>
  <div class="nothing" ng-if="filtered.length == 0">
    <i class="fa fa-search"></i> No results found.
  </div>
</div>
    `,
    restrict: "E",
    scope: {
      options: "=",
      model: "="
    },
    link: function(scope, element, attr) {
      var el = element[0];
      var input = el.querySelector("input");
      var cachedValue;
      var setValue = true;

      input.addEventListener("focus", function() {
        cachedValue = input.value;
        input.value = "";
        element.addClass("show-completion");
        scope.filtered = [];
        setValue = false;
        scope.$apply();
      });
      
      input.addEventListener("blur", function() {
        setTimeout(() => element.removeClass("show-completion"), 100);
        if (!input.value || !setValue) input.value = cachedValue;
      });
      
      input.addEventListener("keyup", function(e) {
        if (!input.value) {
          scope.filtered = [];
          return;
        }
        var regex = new RegExp(input.value, "i");
        scope.filtered = scope.options.filter(d => d.district.match(regex) || d.county.match(regex));
        if (e.keyCode == 13) {
          input.blur();
          scope.setValue(scope.filtered[0]);
        }
        // scope.filtered = scope.filtered.slice(0, 10);
        scope.$apply();
      });
      
      scope.$watch("model", function() {
        var option = scope.options.filter(d => d.code == scope.model);
        option = option.pop();
        var label;
        if (!option) {
          label = "Washington (statewide)";
        } else {
          label = `${option.district} (${option.county})`;
        }
        input.value = label;
      });

      scope.setValue = function(option) {
        setValue = true;
        input.value = `${option.district} (${option.county})`;
        scope.model = option.code || "wa";
      }
    }
  }
});