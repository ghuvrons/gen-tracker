const config = {
  app: {
    version: '1.7',
    title: 'GPS Tracker',
    subTitle: 'GEN Indonesia'
  },
  faker: {
    sample: 0
  },
  socket: {
    address: location.hostname,
    port: 4200
  },
  frame: {
    prefix: '@G',
    id: {
      RESPONSE: 0,
      SIMPLE: 1,
      FULL: 2
    },
    calibratedSeconds: 60
  },
  command: {
    prefix: '@T',
    timeoutMS: 10000
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
}

export { config }
