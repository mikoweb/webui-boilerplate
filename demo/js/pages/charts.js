require(['jquery', 'chartjs', 'chartjs.type.linealt'], function ($, Chart) {
    "use strict";

    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = false;

    var demoChart1;

    demoChart1 = new Chart($("#demoChart1").get(0).getContext("2d")).Line({
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }, {
        animationSteps: 5
    });

    new Chart($("#demoChart2").get(0).getContext("2d")).LineAlt({
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        labelsFilter: function (value, index) {
            return (index + 1) % 2 !== 0;
        },
        labelsRotate: 0,
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }, {
        animation: false
    });

    setInterval(function () {
        var i, j;
        for (i = 0; i < demoChart1.datasets.length; i++) {
            for (j = 0; j < demoChart1.datasets[i].points.length; j++) {
                demoChart1.datasets[i].points[j].value = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
            }
        }

        demoChart1.update();
    }, 1000);
});
