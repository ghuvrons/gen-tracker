const config = {
  app: {
    version: "1.7",
    title: "GPS Tracker",
    subTitle: "GEN Indonesia"
  },
  socket: {
    // address: "localhost",
    // port: 4200,
    address: "broker.hivemq.com",
    port: 8000
  },
  command: {
    prefix: "@C",
    timeoutMS: 20000
  },
  frame: {
    prefix: "@R",
    id: {
      RESPONSE: 0,
      SIMPLE: 1,
      FULL: 2
    },
    calibratedSeconds: 60
  },
  map: {
    zoom: 3,
    centerIndonesia: {
      lat: -2.6000285,
      lng: 118.015776
    },
    borderIndonesia: {
      lngMin: 95.011198,
      lngMax: 141.020354,
      latMin: -11.107187,
      latMax: 5.90713
    }
  },
  finger: {
    max: 5
  }
};

export { config };
