import dayjs from "src/js/dayjs";
import config from "src/js/opt/config";
import { startCase } from "lodash";
import { parseDatetime } from "src/js/utils";
import { Header } from "src/js/opt/header";
import {
  ChangeEndian,
  HexToUnsignedInt,
  HexToSignedInt8,
  HexToSignedInt32,
  IntToHex,
  Dot
} from "src/js/formatter";

const VEHICLE_STATES = {
  UNKNOWN: -3,
  LOST: -2,
  BACKUP: -1,
  NORMAL: 0,
  STANDBY: 1,
  READY: 2,
  RUN: 3
};

const getVehicleState = state =>
  Object.keys(VEHICLE_STATES)[
    Object.values(VEHICLE_STATES).findIndex(v => v === parseInt(state))
  ];

const VCU = ({ required }) => {
  return [
    {
      group: "packet",
      field: "frameID",
      title: "Frame ID",
      required: true,
      chartable: true,
      size: 1,
      format: val => HexToUnsignedInt(ChangeEndian(val)),
      display: valFormat => config.frames[valFormat]
    },
    {
      group: "packet.datetime",
      field: "logDatetime",
      title: "Log Datetime",
      required: true,
      chartable: true,
      size: 7,
      format: v => Number(dayjs(parseDatetime(v), "YYMMDDHHmmss0d").unix()),
      display: vf => dayjs.unix(vf).format("ddd, DD-MM-YY HH:mm:ss")
    },
    {
      group: "vcu",
      field: "driverID",
      title: "Driver ID",
      required: true,
      chartable: true,
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => {
        if (vf === 0xff) return "NONE";
        return IntToHex(vf, 2).toUpperCase();
      }
    },
    {
      group: "vcu",
      field: "eventsGroup",
      title: "Events Group",
      required: true,
      chartable: true,
      size: 8,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => IntToHex(vf, 16).toUpperCase()
    },
    {
      group: "vcu",
      field: "vehicleState",
      title: "Vehicle State",
      required: true,
      chartable: true,
      size: 1,
      format: v => HexToSignedInt8(ChangeEndian(v)),
      display: vf => getVehicleState(vf)
    },
    {
      group: "vcu.gps",
      field: "gpsLongitude",
      title: "GPS Longitude",
      required: false,
      chartable: true,
      size: 4,
      format: v => HexToSignedInt32(ChangeEndian(v)) * 0.0000001,
      display: vf => parseFloat(vf.toFixed(7))
    },
    {
      group: "vcu.gps",
      field: "gpsLatitude",
      title: "GPS Latitude",
      required: false,
      chartable: true,
      size: 4,
      format: v => HexToSignedInt32(ChangeEndian(v)) * 0.0000001,
      display: vf => parseFloat(vf.toFixed(7))
    },
    {
      group: "vcu.gps",
      field: "gpsAltitude",
      title: "GPS Altitude",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: v => HexToUnsignedInt(ChangeEndian(v)) * 0.1,
      display: vf => parseFloat(vf.toFixed(2))
    },
    {
      group: "vcu.gps",
      field: "gpsHDOP",
      title: "GPS HDOP",
      required: false,
      chartable: true,
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)) * 0.1,
      display: vf => parseFloat(vf.toFixed(2))
    },
    {
      group: "vcu.gps",
      field: "gpsVDOP",
      title: "GPS VDOP",
      required: false,
      chartable: true,
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)) * 0.1,
      display: vf => parseFloat(vf.toFixed(2))
    },
    {
      group: "vcu.gps",
      field: "gpsHeading",
      title: "GPS Heading",
      required: false,
      chartable: true,
      unit: "Degree",
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)) * 2,
      display: vf => Dot(vf)
    },
    {
      group: "vcu.gps",
      field: "gpsSatInUse",
      title: "GPS Sat. in use",
      required: false,
      chartable: true,
      unit: "Sat.",
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    },
    {
      group: "vcu",
      field: "speed",
      title: "Vehicle Speed",
      required: false,
      chartable: true,
      unit: "Km/hr",
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    },
    {
      group: "vcu.trip",
      field: "odometer",
      title: "Odometer",
      required: false,
      chartable: true,
      unit: "Km",
      size: 4,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    },
    {
      group: "vcu",
      field: "signal",
      title: "Signal Quality",
      required: false,
      chartable: true,
      unit: "%",
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    },
    {
      group: "vcu",
      field: "batVoltage",
      title: "Battery Voltage",
      required: false,
      chartable: true,
      unit: "mVolt",
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)) * 18,
      display: vf => Dot(vf)
    },
    {
      group: "vcu.estimation",
      field: "rangeEstimation",
      title: "Range Estimation",
      required: false,
      chartable: true,
      unit: "Km",
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    },
    {
      group: "vcu.estimation",
      field: "batteryEstimation",
      title: "Battery Estimation",
      required: false,
      chartable: true,
      unit: "Km/kWh",
      size: 1,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    },
    {
      group: "vcu.trip",
      field: "tripA",
      title: "Trip A",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    },
    {
      group: "vcu.trip",
      field: "tripB",
      title: "Trip B",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: v => HexToUnsignedInt(ChangeEndian(v)),
      display: vf => Dot(vf)
    }
  ].filter(({ required: req }) => req === required);
};

const BMS = ({ required }) => {
  return ["One", "Two"]
    .reduce(
      (acc, i) =>
        acc.concat([
          {
            group: `bms.${i}`,
            field: `bms${i}Id`,
            title: `BMS ${i} ID`,
            required: true,
            size: 4,
            format: v => HexToUnsignedInt(ChangeEndian(v)),
            display: vf => {
              if (vf === 0xffffffff) return "NONE";
              return IntToHex(vf, 8).toUpperCase();
            }
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Voltage`,
            title: `BMS ${i} Voltage`,
            required: true,
            chartable: true,
            unit: "Volt",
            size: 2,
            format: v => HexToUnsignedInt(ChangeEndian(v)) * 0.01,
            display: vf => vf.toFixed(2)
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Current`,
            title: `BMS ${i} Current`,
            required: true,
            chartable: true,
            unit: "Ampere",
            size: 2,
            format: v => HexToUnsignedInt(ChangeEndian(v)) * 0.01 - 50,
            display: vf => vf.toFixed(2)
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Soc`,
            title: `BMS ${i} SoC`,
            required: false,
            chartable: true,
            unit: "%",
            size: 2,
            format: v => HexToUnsignedInt(ChangeEndian(v)) * 0.01,
            display: vf => Dot(vf)
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Temperature`,
            title: `BMS ${i} Temperature`,
            required: false,
            chartable: true,
            unit: "Celcius",
            size: 2,
            format: v => HexToUnsignedInt(ChangeEndian(v)) * 0.1 - 40,
            display: vf => vf.toFixed(2)
          }
        ]),
      []
    )
    .filter(({ required: req }) => req === required);
};

const DEBUG = () => {
  const TASK_LIST = [
    "managerTask",
    "iotTask",
    "reporterTask",
    "commandTask",
    "gpsTask",
    "gyroTask",
    "remoteTask",
    "fingerTask",
    "audioTask",
    "gateTask",
    "canRxTask",
    "canTxTask"
    // "hmi2PowerTask"
  ];
  const GYRO_LIST = ["Yaw (U/D)", "Pitch (F/B)", "Roll (L/R)"];

  return [
    ...TASK_LIST.reduce((acc, task) => {
      return acc.concat([
        {
          group: `vcu.task.wakeup`,
          field: `${task}Wakeup`,
          title: `${startCase(task)} wakeup`,
          required: false,
          chartable: true,
          unit: "s",
          size: 1,
          format: v => HexToUnsignedInt(ChangeEndian(v)),
          display: vf => Dot(vf)
        },
        {
          group: `vcu.task.stack`,
          field: `${task}Stack`,
          title: `${startCase(task)} stack`,
          required: false,
          chartable: true,
          unit: "Bytes",
          size: 2,
          format: v => HexToUnsignedInt(ChangeEndian(v)),
          display: vf => Dot(vf)
        }
      ]);
    }, []),
    ...GYRO_LIST.reduce((acc, gyro) => {
      return acc.concat([
        {
          group: `vcu.gyro`,
          field: `gyro${gyro}`,
          title: `Gyro ${gyro}`,
          required: false,
          chartable: true,
          unit: "Degree",
          size: 1,
          format: v => HexToSignedInt8(ChangeEndian(v)),
          display: vf => Dot(vf)
        }
      ]);
    }, [])
  ];
};

const Report = [
  ...Header,
  ...VCU({ required: true }),
  ...BMS({ required: true }),
  ...VCU({ required: false }),
  ...BMS({ required: false }),
  ...DEBUG()
].map((el, idx) => ({
  ...el,
  no: idx
}));

export { VEHICLE_STATES, Report };
