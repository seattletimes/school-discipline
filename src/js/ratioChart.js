var app = require("./application");

var radius = 20;

var drawRatio = function(context, canvas, r) {
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
  context.fillStyle = "rgb(123, 90, 166)";
  context.fill();
};

var drawBase = function(context, canvas) {
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    context.strokeStyle = "#BBB";
    context.fillStyle = "#EEE";
    context.stroke();
    context.fill();
}

app.directive("ratioChart", function() {
  return {
    template: `
<div class="aspect-outer">
  <div class="aspect-inner">
    <canvas class="chart"></canvas>
  </div>
</div>
    `,
    restrict: "E",
    scope: {
      ratio: "="
    },
    link: function(scope, element, attrs) {
      var canvas = element[0].querySelector("canvas");
      var context = canvas.getContext("2d");
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      scope.$watch("ratio", function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        var a = Math.PI * (radius * radius);
        var r = Math.sqrt((a * scope.ratio) / Math.PI);

        if (scope.ratio > 1) {
          drawRatio(context, canvas, r);
          drawBase(context, canvas);
        } else {
          drawBase(context, canvas);
          drawRatio(context, canvas, r);
        }
      });
    }
  }
})