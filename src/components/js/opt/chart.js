import { unix2time } from "components/js/utils";
const numeral = require("numeral");

export default {
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        label: "",
        backgroundColor: "#f87979",
        fill: true,
        showLine: true,
        pointRadius: 2,
      },
    ],
  },
  options: {
    animation: {
      duration: 10,
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
      align: "end",
      labels: {
        fontColor: "#666",
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: function (value) {
              return unix2time(value);
            },
            max: 1,
            min: 0,
            fontColor: "#666",
          },
          scaleLabel: {
            display: true,
            labelString: "Log Datetime",
            fontColor: "#666",
          },
          gridLines: {
            display: true,
            lineWidth: 0.3,
            color: "#666",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            callback: function (value) {
              return numeral(value).format("0.0a");
            },
            beginAtZero: true,
            max: 1,
            min: 0,
            fontColor: "#666",
          },
          scaleLabel: {
            display: true,
            labelString: "Value",
            fontColor: "#666",
          },
          gridLines: {
            display: true,
            lineWidth: 0.3,
            color: "#666",
          },
        },
      ],
    },
  },
};
