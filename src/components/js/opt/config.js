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

export { config };
