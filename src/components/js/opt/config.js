import { unix2time } from "components/js/utils";

const config = {
  app: {
    version: "1.7",
    title: "GPS Tracker",
    subTitle: "GEN Indonesia",
  },
  socket: {
    address: "broker.hivemq.com",
    port: 8000,
  },
  command: {
    prefix: "@C",
    timeoutMS: 10000,
  },
  frame: {
    list: ["RESPONSE", "SIMPLE", "FULL"],
    prefix: "@R",
    id: {
      RESPONSE: 0,
      SIMPLE: 1,
      FULL: 2,
    },
  },
  finger: {
    max: 5,
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
  timediff: 60,
  timezone: "Asia/Jakarta",
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
      display: true,
      align: "end",
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
          },
          scaleLabel: {
            display: true,
            labelString: "Log Datetime",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 1,
            min: 0,
          },
          scaleLabel: {
            display: true,
            labelString: "Value",
          },
        },
      ],
    },
  },
};

export { config, chart };
