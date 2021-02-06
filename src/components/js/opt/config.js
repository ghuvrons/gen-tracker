import { unix2time } from "components/js/utils";

const config = {
  app: {
    version: "1.25",
    title: "GEN Tracker",
    subTitle: "GEN Indonesia",
  },
  mqtt: {
    address: "mqtt.eclipseprojects.io",
    port: 443,
    path: "/mqtt",
    username: "",
    password: "",
  },
  command: {
    prefix: "@C",
    timeoutMS: 5000,
  },
  frame: {
    prefix: "@R",
    name: ["RESPONSE", "SIMPLE", "FULL"],
    id: {
      RESPONSE: 0,
      SIMPLE: 1,
      FULL: 2,
    },
  },
  map: {
    zoom: 3,
    centerIndonesia: {
      lat: -2.6000285,
      lng: 118.015776,
    },
    borderIndonesia: {
      lngMin: 95.011198,
      lngMax: 141.020354,
      latMin: -11.107187,
      latMax: 5.90713,
    },
  },
  timediff: 5 * 60,
  timezone: "Asia/Jakarta",
  maxStorage: {
    reports: 1000,
    commands: 100,
  },
};

const chart = {
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

export { config, chart };
