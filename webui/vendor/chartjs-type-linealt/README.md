```js
var ctx = document.getElementById("chart").getContext("2d");
var data = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    labelsFilter: function (label) {
        //return true if this label should be filtered out
        return label % 5 !== 0;
    },
    labelsRotate: 0,
    datasets: [{
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 34, 21, 11, 11, 34, 34, 12, 24, 45, 65, 34, 21, 11, 11, 34, 34, 12, 24, 45, 65, 34, 21, 11, 11, 34, 34, 12, 24, 45]
    }, ]
};

var myLineChart = new Chart(ctx).LineAlt(data);
```