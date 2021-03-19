export default {
  app: {
    version: "2.36",
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
    ack: "@A",
    report: "@N",
    command: "@C",
    response: "@S",
  },
  command: {
    keypass: "ac1a1139857263a346ca84458ed8dd99",
    retryInterval: 10000,
  },
  driveMode: ["ECONOMY", "STANDARD", "SPORT"],
  frames: ["SIMPLE", "FULL"],
  timezone: "Asia/Jakarta",
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
};
