import moment from "moment";
import {
  ChangeEndian,
  Dot,
  HexToAscii,
  HexToInt,
  HexToSignedInt,
  IntToHex
} from "components/js/helper";

const Header = [
  {
    field: "prefix",
    title: "Prefix",
    header: true,
    required: true,
    size: 2,
    format: val => HexToAscii(ChangeEndian(val)),
    display: valFormat => valFormat
  },
  {
    field: "crc",
    title: "CRC",
    header: true,
    required: true,
    chartable: true,
    size: 4,
    format: val => HexToInt(ChangeEndian(val)),
    display: valFormat => IntToHex(valFormat, 8).toUpperCase()
  },
  {
    field: "size",
    title: "Size",
    header: true,
    required: true,
    chartable: true,
    unit: "Bytes",
    size: 1,
    format: val => HexToInt(ChangeEndian(val)),
    display: valFormat => Dot(valFormat)
  },
  {
    field: "frameID",
    title: "Frame ID",
    header: true,
    required: true,
    chartable: true,
    unit: "Type",
    size: 1,
    format: val => HexToInt(ChangeEndian(val)),
    display: valFormat => {
      let frameIDs = ["Response", "Simple", "Full"];

      return `${valFormat} (${frameIDs[valFormat]})`;
    }
  },
  {
    field: "unitID",
    title: "Unit ID",
    header: true,
    required: true,
    size: 4,
    format: val => HexToInt(ChangeEndian(val)),
    display: valFormat => valFormat
  },
  {
    field: "sequentialID",
    title: "Sequential ID",
    required: true,
    chartable: true,
    size: 2,
    format: val => HexToInt(ChangeEndian(val)),
    display: valFormat => Dot(valFormat)
  }
];

const BMS = ({ required }) => {
  const BMSCount = 2;
  let fields = [];

  for (let i = 1; i <= BMSCount; i++) {
    let tmp = [
      {
        field: `BMSId${i}`,
        title: `BMS-${i} ID`,
        required: true,
        size: 4,
        format: val => HexToInt(ChangeEndian(val)),
        display: valFormat => {
          if (valFormat === 0xffffffff) {
            return "NONE";
          }
          return IntToHex(valFormat, 8).toUpperCase();
        }
      },
      {
        field: `BMSVoltage${i}`,
        title: `BMS-${i} Voltage`,
        required: true,
        chartable: true,
        unit: "Volt",
        size: 2,
        format: val => HexToInt(ChangeEndian(val)) * 0.01,
        display: valFormat => valFormat.toFixed(2)
      },
      {
        field: `BMSCurrent${i}`,
        title: `BMS-${i} Current`,
        required: true,
        chartable: true,
        unit: "Ampere",
        size: 2,
        format: val => HexToInt(ChangeEndian(val)) * 0.01 - 50,
        display: valFormat => valFormat.toFixed(2)
      },
      {
        field: `BMSSoc${i}`,
        title: `BMS-${i} SoC`,
        required: false,
        chartable: true,
        unit: "%",
        size: 2,
        format: val => HexToInt(ChangeEndian(val)),
        display: valFormat => Dot(valFormat)
      },
      {
        field: `BMSTemperature${i}`,
        title: `BMS-${i} Temperature`,
        required: false,
        chartable: true,
        unit: "Celcius",
        size: 2,
        format: val => HexToInt(ChangeEndian(val)) * 0.1 - 40,
        display: valFormat => valFormat.toFixed(2)
      }
    ];
    fields = [...fields, ...tmp];
  }

  return fields.filter(({ required: _required }) => _required === required);
};

const VCU = ({ required }) => {
  let fields = [
    {
      field: "rtcSendDatetime",
      title: "RTC Send Datetime",
      required: true,
      chartable: true,
      size: 8,
      format: val => {
        return Number(
          moment(
            HexToInt(ChangeEndian(val)).toString(),
            "YYMMDDHHmmssE"
          ).format("X")
        );
      },
      display: valFormat => {
        return moment(valFormat, "X").format("ddd, DD MMM YYYY, HH:mm:ss");
      }
    },
    {
      field: "rtcLogDatetime",
      title: "RTC Log Datetime",
      required: true,
      chartable: true,
      size: 8,
      format: val => {
        return Number(
          moment(
            HexToInt(ChangeEndian(val)).toString(),
            "YYMMDDHHmmssE"
          ).format("X")
        );
      },
      display: valFormat => {
        return moment(valFormat, "X").format("ddd, DD MMM YYYY, HH:mm:ss");
      }
    },
    {
      field: "driverID",
      title: "Driver ID",
      required: true,
      chartable: true,
      size: 1,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => {
        if (valFormat === 0xff) {
          return "NONE";
        }
        return IntToHex(valFormat, 2).toUpperCase();
      }
    },
    {
      field: "eventsGroup",
      title: "Events Group",
      required: true,
      chartable: true,
      size: 8,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => IntToHex(valFormat, 16).toUpperCase()
    },
    {
      field: "gpsLongitude",
      title: "GPS Longitude",
      required: false,
      chartable: true,
      size: 4,
      format: val => HexToSignedInt(ChangeEndian(val)) * 0.0000001,
      display: valFormat => parseFloat(valFormat.toFixed(7))
    },
    {
      field: "gpsLatitude",
      title: "GPS Latitude",
      required: false,
      chartable: true,
      size: 4,
      format: val => HexToSignedInt(ChangeEndian(val)) * 0.0000001,
      display: valFormat => parseFloat(valFormat.toFixed(7))
    },
    {
      field: "gpsAltitude",
      title: "GPS Altitude",
      required: false,
      chartable: true,
      size: 4,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => {
        return Dot(valFormat);
      }
    },
    {
      field: "gpsHDOP",
      title: "GPS HDOP",
      required: false,
      chartable: true,
      size: 1,
      format: val => HexToInt(ChangeEndian(val)) * 0.1,
      display: valFormat => {
        return Dot(valFormat);
      }
    },
    {
      field: "gpsVDOP",
      title: "GPS VDOP",
      required: false,
      chartable: true,
      size: 1,
      format: val => HexToInt(ChangeEndian(val)) * 0.1,
      display: valFormat => {
        return Dot(valFormat);
      }
    },
    {
      field: "gpsHeading",
      title: "GPS Heading",
      required: false,
      chartable: true,
      unit: "Degree",
      size: 1,
      format: val => HexToInt(ChangeEndian(val)) * 2,
      display: valFormat => Dot(valFormat)
    },
    {
      field: "speed",
      title: "Vehicle Speed",
      required: false,
      chartable: true,
      unit: "Km/hr",
      size: 1,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    },
    {
      field: "odometer",
      title: "Odometer",
      required: false,
      chartable: true,
      unit: "Km",
      size: 4,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    },
    {
      field: "odometer_m",
      title: "Odometer_m",
      required: false,
      chartable: true,
      unit: "M",
      size: 4,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    },
    {
      field: "signal",
      title: "Signal Quality",
      required: false,
      chartable: true,
      unit: "%",
      size: 1,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    },
    {
      field: "batVoltage",
      title: "Battery Voltage",
      required: false,
      chartable: true,
      unit: "mVolt",
      size: 1,
      format: val => HexToInt(ChangeEndian(val)) * 18,
      display: valFormat => Dot(valFormat)
    },
    {
      field: "rangeApproximation",
      title: "Range Approximation",
      required: false,
      chartable: true,
      unit: "Km",
      size: 1,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    },
    {
      field: "batteryEfficiency",
      title: "Battery Efficiency",
      required: false,
      chartable: true,
      unit: "Km/kWh",
      size: 1,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    },
    {
      field: "tripA",
      title: "Trip A",
      required: false,
      chartable: true,
      unit: "Km",
      size: 4,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    },
    {
      field: "tripB",
      title: "Trip B",
      required: false,
      chartable: true,
      unit: "Km",
      size: 4,
      format: val => HexToInt(ChangeEndian(val)),
      display: valFormat => Dot(valFormat)
    }
  ];

  return fields.filter(({ required: _required }) => _required === required);
};

const Report = [
  ...Header,
  ...VCU({ required: true }),
  ...BMS({ required: true }),
  ...VCU({ required: false }),
  ...BMS({ required: false })
];

export { Header, Report };
