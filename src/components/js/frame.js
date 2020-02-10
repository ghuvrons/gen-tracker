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
  }
]

const Report = [
  ...Header,
  {
    field: 'sequentialID',
    title: 'Sequential ID',
    required: true,
    chartable: true,
    size: 2,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat)
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
    field: 'speed',
    title: 'Vehicle Speed',
    required: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' km/hr'
  },
  {
    field: 'gpsLongitude',
    title: 'GPS Longitude',
    optional: true,
    size: 4,
    format: (val) => HexToSignedInt(ChangeEndian(val)) * 0.0000001,
    display: (valFormat) => valFormat
  },
  {
    field: 'gpsLatitude',
    title: 'GPS Latitude',
    optional: true,
    size: 4,
    format: (val) => HexToSignedInt(ChangeEndian(val)) * 0.0000001,
    display: (valFormat) => valFormat
  },
  {
    field: 'gpsHDOP',
    title: 'GPS HDOP',
    optional: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian(val)) * 0.1,
    display: (valFormat) => {
      let rating = 'Ideal'

      if (valFormat > 1 && valFormat <= 2) {
        rating = 'Excellent'
      } else if (valFormat > 2 && valFormat <= 5) {
        rating = 'Good'
      } else if (valFormat > 5 && valFormat <= 10) {
        rating = 'Moderate'
      } else if (valFormat > 10 && valFormat <= 20) {
        rating = 'Fair'
      } else if (valFormat > 20) {
        rating = 'Poor'
      }

      return `${Dot(valFormat)} (${rating})`
    }
  },
  {
    field: 'gpsHeading',
    title: 'GPS Heading',
    optional: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' deg'
  },
  {
    field: 'odometer',
    title: 'Odometer',
    optional: true,
    chartable: true,
    size: 4,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' km'
  },
  {
    field: 'batVoltage',
    title: 'Backup Bat. Voltage',
    optional: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian(val)) * 13,
    display: (valFormat) => Dot(valFormat) + ' mV'
  },
  {
    field: 'reportRange',
    title: 'Report Range Left',
    optional: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' km'
  },
  {
    field: 'reportBattery',
    title: 'Report Bat. Efficiency',
    optional: true,
    chartable: true,
    size: 1,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' km/kWh'
  },
  {
    field: 'tripA',
    title: 'Trip A',
    optional: true,
    chartable: true,
    size: 4,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' km'
  },
  {
    field: 'tripB',
    title: 'Trip B',
    optional: true,
    chartable: true,
    size: 4,
    format: (val) => HexToInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat) + ' km'
  }
]

export { Header, Report }
