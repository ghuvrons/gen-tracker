export default {
  app: {
    version: "2.83",
    title: "eBike Tracker",
    subTitle: "GEN Indonesia",
  },
  mqtt: {
    // host: `wss://mqtt.eclipseprojects.io:443/mqtt`,
    host_wss: `wss://test.mosquitto.org:8081/mqtt`,
    host_ws: `ws://test.mosquitto.org:8080/mqtt`,
    username: "",
    password: "",
  },
  prefix: {
    ack: "@A",
    report: "@T",
    command: "@C",
    response: "@S",
  },
  command: {
    keypass: "4eb75b030e507117368b9b5275690684",
    retry: 7500,
  },
  mode: {
    drive: ["ECONOMY", "STANDARD", "SPORT"],
    trip: ["A", "B", "ODO"],
    report: ["RANGE", "AVERAGE"],
  },
  frames: ["UNKNOWN", "SIMPLE", "FULL"],
  timezone: "Asia/Jakarta",
  map: {
    apiKey: "AIzaSyBE8UhrrFkz9m37oowPkHX9to8NXcHw4Ak",
    zoom: 3,
    hdopMin: 3,
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
