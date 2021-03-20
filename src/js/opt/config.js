export default {
  app: {
    version: "2.47",
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
    report: "@T",
    command: "@C",
    response: "@S",
  },
  command: {
    keypass: "dd31690d7be69fd3237c64122083c132",
    retryInterval: 10000,
  },
  mode: {
    drive: ["ECONOMY", "STANDARD", "SPORT"],
  },
  frames: ["SIMPLE", "FULL"],
  timezone: "Asia/Jakarta",
  map: {
    apiKey: "AIzaSyBE8UhrrFkz9m37oowPkHX9to8NXcHw4Ak",
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
