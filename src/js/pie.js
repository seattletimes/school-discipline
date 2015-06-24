var app = require("./application");

app.directive("pieChart", function() {
  return {
    template: `
<canvas width="{{width || 30}}" height="{{height || 30}}"></canvas>
    `,
    restrict: "E",
    scope: {
      percentage: "=",
      width: "@",
      height: "@"
    },
    link: function(scope, element) {

      var canvas = element[0].querySelector("canvas");
      var context = canvas.getContext("2d");

      scope.$watch("percentage", function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //draw "plate"
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        context.fillStyle = "rgb(224, 224, 224)";
        context.fill();

        //draw slice
        var start = Math.PI * 1.5;
        var slice = Math.PI * 2 * scope.percentage;
        context.beginPath();
        context.moveTo(canvas.width / 2, canvas.height / 2);
        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, start, start + slice);
        context.fillStyle = "rgb(7, 119, 179)";
        context.fill();
      });
    }
  }
});