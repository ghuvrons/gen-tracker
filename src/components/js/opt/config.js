export default {
  app: {
    version: "1.38",
    title: "eBike Tracker",
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
    timeout: 10,
  },
  prefix: {
    report: "@R",
    command: "@C",
    response: "@S",
  },
  frame: {
    name: ["SIMPLE", "FULL"],
    id: {
      SIMPLE: 0,
      FULL: 1,
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
  timeDilation: 5 * 60,
  timezone: "Asia/Jakarta",
  maxStorage: {
    reports: 500,
    commands: 50,
  },
};
