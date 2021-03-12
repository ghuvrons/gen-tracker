export default {
  app: {
    version: "2.5",
    title: "eBike Tracker",
    subTitle: "GEN Indonesia",
  },
  mqtt: {
    // host: `wss://mqtt.eclipseprojects.io:443/mqtt`,
    host: `wss://test.mosquitto.org:8081/mqtt`,
    username: "",
    password: "",
  },
  prefix: {
    report: "@R",
    command: "@C",
    response: "@S",
  },
  frames: ["SIMPLE", "FULL"],
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
  timezone: "Asia/Jakarta",
};
