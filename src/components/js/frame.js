import moment from 'moment'
import { ChangeEndian, Dot, HexToAscii, HexToInt, HexToSignedInt, IntToHex } from 'components/js/helper'

const Header = [
  {
    field: 'prefix',
    title: 'Prefix',
    header: true,
    required: true,
    size: 2,
    format: (val) => HexToAscii(ChangeEndian(val)),
    display: (valFormat) => valFormat
  },
  {
    field: 'crc',
    title: 'CRC',
    header: true,
    required: true,
    chartable: true,
    size: 4,
    format: (val) => parseInt(ChangeEndian(val), 16),
    display: (valFormat) => IntToHex(valFormat, 16).slice(8).toUpperCase()
  },
  {
    field: 'size',
    title: 'Size',
    header: true,
    required: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' bytes'
  },
  {
    field: 'frameID',
    title: 'Frame ID',
    header: true,
    required: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian((val))),
    display: (valFormat) => {
      let frameIDs = ['Response', 'Simple', 'Full']

      return `${valFormat} (${frameIDs[valFormat]})`
    }
  },
  {
    field: 'unitID',
    title: 'Unit ID',
    header: true,
    required: true,
    size: 4,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => valFormat
  },
  {
    field: 'sequentialID',
    title: 'Sequential ID',
    required: true,
    chartable: true,
    size: 2,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat)
  }
]

const BMS = ({ required }) => {
  const BMSCount = 2
  let fields = []

  for (let i = 1; i <= BMSCount; i++) {
    let tmp = [
      {
        field: `BMSId${i}`,
        title: `BMS-${i} ID`,
        required: true,
        size: 4,
        format: (val) => HexToInt(ChangeEndian(val)),
        display: (valFormat) => {
          return valFormat === 0xFFFFFFFF ? 'NONE' : valFormat
        }
      },
      {
        field: `BMSVoltage${i}`,
        title: `BMS-${i} Voltage`,
        required: true,
        chartable: true,
        size: 2,
        format: (val) => HexToInt(ChangeEndian(val)) * 0.01,
        display: (valFormat) => valFormat.toFixed(2) + ' V'
      },
      {
        field: `BMSCurrent${i}`,
        title: `BMS-${i} Current`,
        required: true,
        chartable: true,
        size: 2,
        format: (val) => (HexToInt(ChangeEndian(val)) * 0.01) - 50,
        display: (valFormat) => valFormat.toFixed(2) + ' A'
      },
      {
        field: `BMSSoc${i}`,
        title: `BMS-${i} SoC`,
        required: false,
        chartable: true,
        size: 2,
        format: (val) => HexToInt(ChangeEndian(val)),
        display: (valFormat) => Dot(valFormat) + ' %'
      },
      {
        field: `BMSTemperature${i}`,
        title: `BMS-${i} Temperature`,
        required: false,
        chartable: true,
        size: 2,
        format: (val) => (HexToInt(ChangeEndian(val)) * 0.1) - 40,
        display: (valFormat) => valFormat.toFixed(2) + ' C'
      }
    ]
    fields = [...fields, ...tmp]
  }
  return fields.filter(el => el.required === required)
}

const VCU = ({ required }) => {
  let fields = [
    {
      field: 'rtcSendDatetime',
      title: 'RTC Send Datetime',
      required: true,
      size: 8,
      format: (val) => HexToInt(ChangeEndian(val)).toString(),
      display: (valFormat) => {
      // datetime string to timestamp
        return moment(valFormat, 'YYMMDDHHmmssE').format('ddd, DD MMM YYYY, HH:mm:ss')
      }
    },
    {
      field: 'rtcLogDatetime',
      title: 'RTC Log Datetime',
      required: true,
      size: 8,
      format: (val) => HexToInt(ChangeEndian(val)).toString(),
      display: (valFormat) => {
      // datetime string to timestamp
        return moment(valFormat, 'YYMMDDHHmmssE').format('ddd, DD MMM YYYY, HH:mm:ss')
      }
    },
    {
      field: 'driverID',
      title: 'Driver ID',
      required: true,
      chartable: true,
      size: 1,
      format: (val) => HexToInt(ChangeEndian(val)),
      display: (valFormat) => valFormat
    },
    {
      field: 'eventsGroup',
      title: 'Events Group',
      required: true,
      chartable: true,
      size: 8,
      format: (val) => parseInt(ChangeEndian(val), 16),
      display: (valFormat) => IntToHex(valFormat, 16)
    },
    {
      field: 'gpsLongitude',
      title: 'GPS Longitude',
      required: false,
      chartable: true,
      size: 4,
      format: (val) => HexToSignedInt(ChangeEndian(val)) * 0.0000001,
      display: (valFormat) => parseFloat(valFormat.toFixed(7))
    },
    {
      field: 'gpsLatitude',
      title: 'GPS Latitude',
      required: false,
      chartable: true,
      size: 4,
      format: (val) => HexToSignedInt(ChangeEndian(val)) * 0.0000001,
      display: (valFormat) => parseFloat(valFormat.toFixed(7))
    },
    {
      field: 'gpsHDOP',
      title: 'GPS HDOP',
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToInt(ChangeEndian(val)) * 0.1,
      display: (valFormat) => {
        return Dot(valFormat)
      }
    },
    {
      field: 'gpsHeading',
      title: 'GPS Heading',
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToInt(ChangeEndian(val)) * 2,
      display: (valFormat) => Dot(valFormat) + ' deg'
    },
    {
      field: 'speed',
      title: 'Vehicle Speed',
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToInt(ChangeEndian(val)),
      // FIXME: change from meter to km/hr
      display: (valFormat) => Dot(valFormat) + ' m/s'
    },
    {
      field: 'odometer',
      title: 'Odometer',
      required: false,
      chartable: true,
      size: 4,
      format: (val) => HexToInt(ChangeEndian(val)),
      // FIXME: change from meter to km
      display: (valFormat) => Dot(valFormat) + ' m'
    },
    {
      field: 'batVoltage',
      title: 'Battery Voltage',
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToInt(ChangeEndian(val)) * 18,
      display: (valFormat) => Dot(valFormat) + ' mV'
    },
    {
      field: 'rangeApproximation',
      title: 'Range Approximation',
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat) + ' km'
    },
    {
      field: 'batteryEfficiency',
      title: 'Battery Efficiency',
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat) + ' km/kWh'
    },
    {
      field: 'tripA',
      title: 'Trip A',
      required: false,
      chartable: true,
      size: 4,
      format: (val) => HexToInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat) + ' km'
    },
    {
      field: 'tripB',
      title: 'Trip B',
      required: false,
      chartable: true,
      size: 4,
      format: (val) => HexToInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat) + ' km'
    }
  ]

  return fields.filter(el => el.required === required)
}

const Report = [
  ...Header,
  ...VCU({ required: true }),
  ...BMS({ required: true }),
  ...VCU({ required: false }),
  ...BMS({ required: false })
]

export { Header, Report }
