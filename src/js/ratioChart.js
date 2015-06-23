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

      scope.$watch("ratio", function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        var a = Math.PI * (radius * radius);
        var r = Math.sqrt((a * scope.ratio) / Math.PI);

        //draw ratio circle
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
        context.fillStyle = "rgb(123, 90, 166)";
        context.fill();

        //draw standard circle
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        context.strokeStyle = scope.ratio > 1 ? "white" : "#BBB";
        context.stroke();
      });
    }
  }
})