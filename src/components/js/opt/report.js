import moment from "moment";
import { startCase } from "lodash";
import { parseDatetime } from "components/js/utils";
import { Header } from "components/js/opt/header";
import {
  ChangeEndian,
  HexToUnsignedInt,
  HexToSignedInt8,
  HexToSignedInt32,
  IntToHex,
  Dot,
} from "components/js/helper";

const VCU = ({ required }) => {
  const RTC = ["sendDatetime", "logDatetime"];

  let fields = [
    ...RTC.reduce((carry, rtc) => {
      return carry.concat([
        {
          field: rtc,
          title: startCase(rtc),
          required: true,
          chartable: true,
          size: 7,
          format: (val) =>
            Number(moment(parseDatetime(val), "YYMMDDHHmmssEE").format("X")),
          display: (valFormat) =>
            moment(valFormat, "X").format("ddd, DD MMM YYYY, HH:mm:ss"),
        },
      ]);
    }, []),
    {
      field: "driverID",
      title: "Driver ID",
      required: true,
      chartable: true,
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => {
        if (valFormat === 0xff) return "NONE";

        return IntToHex(valFormat, 2).toUpperCase();
      },
    },
    {
      field: "eventsGroup",
      title: "Events Group",
      required: true,
      chartable: true,
      size: 8,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => IntToHex(valFormat, 16).toUpperCase(),
    },
    {
      field: "vehicleState",
      title: "Vehicle State",
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToSignedInt8(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "gpsLongitude",
      title: "GPS Longitude",
      required: false,
      chartable: true,
      size: 4,
      format: (val) => HexToSignedInt32(ChangeEndian(val)) * 0.0000001,
      display: (valFormat) => parseFloat(valFormat.toFixed(7)),
    },
    {
      field: "gpsLatitude",
      title: "GPS Latitude",
      required: false,
      chartable: true,
      size: 4,
      format: (val) => HexToSignedInt32(ChangeEndian(val)) * 0.0000001,
      display: (valFormat) => parseFloat(valFormat.toFixed(7)),
    },
    {
      field: "gpsAltitude",
      title: "GPS Altitude",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 0.1,
      display: (valFormat) => parseFloat(valFormat.toFixed(2)),
    },
    {
      field: "gpsHDOP",
      title: "GPS HDOP",
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 0.1,
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "gpsVDOP",
      title: "GPS VDOP",
      required: false,
      chartable: true,
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 0.1,
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "gpsHeading",
      title: "GPS Heading",
      required: false,
      chartable: true,
      unit: "Degree",
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 2,
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "gpsSatInUse",
      title: "GPS Sat. in use",
      required: false,
      chartable: true,
      unit: "Sat.",
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "speed",
      title: "Vehicle Speed",
      required: false,
      chartable: true,
      unit: "Km/hr",
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "odometer",
      title: "Odometer",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "signal",
      title: "Signal Quality",
      required: false,
      chartable: true,
      unit: "%",
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "batVoltage",
      title: "Battery Voltage",
      required: false,
      chartable: true,
      unit: "mVolt",
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 18,
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "rangeApproximation",
      title: "Range Approximation",
      required: false,
      chartable: true,
      unit: "Km",
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "batteryEfficiency",
      title: "Battery Efficiency",
      required: false,
      chartable: true,
      unit: "Km/kWh",
      size: 1,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "tripA",
      title: "Trip A",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
    {
      field: "tripB",
      title: "Trip B",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: (val) => HexToUnsignedInt(ChangeEndian(val)),
      display: (valFormat) => Dot(valFormat),
    },
  ];

  return fields.filter((el) => el.required === required);
};

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
        format: (val) => HexToUnsignedInt(ChangeEndian(val)),
        display: (valFormat) => {
          if (valFormat === 0xffffffff) return "NONE";

          return IntToHex(valFormat, 8).toUpperCase();
        },
      },
      {
        field: `BMSVoltage${i}`,
        title: `BMS-${i} Voltage`,
        required: true,
        chartable: true,
        unit: "Volt",
        size: 2,
        format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 0.01,
        display: (valFormat) => valFormat.toFixed(2),
      },
      {
        field: `BMSCurrent${i}`,
        title: `BMS-${i} Current`,
        required: true,
        chartable: true,
        unit: "Ampere",
        size: 2,
        format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 0.01 - 50,
        display: (valFormat) => valFormat.toFixed(2),
      },
      {
        field: `BMSSoc${i}`,
        title: `BMS-${i} SoC`,
        required: false,
        chartable: true,
        unit: "%",
        size: 2,
        format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 0.01,
        display: (valFormat) => Dot(valFormat),
      },
      {
        field: `BMSTemperature${i}`,
        title: `BMS-${i} Temperature`,
        required: false,
        chartable: true,
        unit: "Celcius",
        size: 2,
        format: (val) => HexToUnsignedInt(ChangeEndian(val)) * 0.1 - 40,
        display: (valFormat) => valFormat.toFixed(2),
      },
    ];
    fields = [...fields, ...tmp];
  }

  return fields.filter(({ required: _required }) => _required === required);
};

const TEST = () => {
  const TASK_LIST = [
    "ManagerTask",
    "IotTask",
    "ReporterTask",
    "CommandTask",
    "GpsTask",
    "GyroTask",
    "RemoteTask",
    "FingerTask",
    "AudioTask",
    "GateTask",
    "CanRxTask",
    "CanTxTask",
    "Hmi2PowerTask",
  ];
  const GYRO_LIST = ["Yaw", "Pitch", "Roll"];

  return [
    ...TASK_LIST.reduce((carry, task) => {
      return carry.concat([
        {
          field: `${task}-wakeup`,
          title: `${task} wakeup`,
          required: false,
          chartable: true,
          unit: "s",
          size: 1,
          format: (val) => HexToUnsignedInt(ChangeEndian(val)),
          display: (valFormat) => Dot(valFormat),
        },
        {
          field: `${task}-stack`,
          title: `${task} stack`,
          required: false,
          chartable: true,
          unit: "words",
          size: 2,
          format: (val) => HexToUnsignedInt(ChangeEndian(val)),
          display: (valFormat) => Dot(valFormat),
        },
      ]);
    }, []),
    ...GYRO_LIST.reduce((carry, gyro) => {
      return carry.concat([
        {
          field: `motion${gyro}`,
          title: `Motion ${gyro}`,
          required: false,
          chartable: true,
          unit: "Degree",
          size: 1,
          format: (val) => HexToSignedInt8(ChangeEndian(val)),
          display: (valFormat) => Dot(valFormat),
        },
      ]);
    }, []),
  ];
};

const Report = [
  ...Header,
  ...VCU({ required: true }),
  ...BMS({ required: true }),
  ...VCU({ required: false }),
  ...BMS({ required: false }),
  ...TEST(),
];

export { Report };
