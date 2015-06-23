var app = require("./application");

var radius = 20;

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

      //draw ratio circle
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, radius * scope.ratio, 0, Math.PI * 2);
      context.fillStyle = "red";
      context.fill();

      //draw standard circle
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      context.strokeStyle = scope.ratio > 1 ? "white" : "#BBB";
      context.stroke();
    }
  }
})