import { Platform } from "quasar";
import { get } from "lodash";

export default {
  app: {
    version: "1.1.0",
    title: "eBike Tracker",
    subTitle: "GEN Indonesia",
  },
  mqtt: {
    // host: `wss://mqtt.eclipseprojects.io:443/mqtt`,
    host: `wss://test.mosquitto.org:8081/mqtt`,
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
  maxStorage: {
    reports: get("is.desktop", Platform) ? 500 : 100,
    responses: get("is.desktop", Platform) ? 50 : 10,
    commands: get("is.desktop", Platform) ? 50 : 10,
  },
};
