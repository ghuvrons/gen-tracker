import dayjs from "src/js/dayjs";
import config from "src/js/opt/config";
import { startCase } from "lodash";
import { parseDatetime } from "src/js/utils";
import { Header } from "src/js/opt/header";
import {
  cend,
  HexToUnsignedInt,
  HexToSignedInt8,
  HexToSignedInt32,
  IntToHex,
  Dot,
} from "src/js/formatter";

const VEHICLE_STATES = {
  UNKNOWN: -3,
  LOST: -2,
  BACKUP: -1,
  NORMAL: 0,
  STANDBY: 1,
  READY: 2,
  RUN: 3,
};

const getVehicleState = (state) =>
  Object.keys(VEHICLE_STATES)[
    Object.values(VEHICLE_STATES).findIndex((v) => v === parseInt(state))
  ];

const VCU = () => {
  return [
    {
      group: "packet",
      field: "frameID",
      title: "Frame ID",
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => config.frames[vf],
    },
    {
      group: "packet.datetime",
      field: "logDatetime",
      title: "Log Datetime",
      required: true,
      chartable: true,
      size: 7,
      format: (v) => Number(dayjs(parseDatetime(v), "YYMMDDHHmmss0d").unix()),
      display: (vf) => dayjs.unix(vf).format("ddd, DD-MM-YY HH:mm:ss"),
    },
    {
      group: "vcu",
      field: "driverID",
      title: "Driver ID",
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => {
        if (vf === 0xff) return "NONE";
        return IntToHex(vf, 2).toUpperCase();
      },
    },
    {
      group: "vcu",
      field: "eventsGroup",
      title: "Events Group",
      required: true,
      chartable: true,
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => IntToHex(vf, 4).toUpperCase(),
    },
    {
      group: "vcu",
      field: "vehicleState",
      title: "Vehicle State",
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToSignedInt8(cend(v)),
      display: (vf) => getVehicleState(vf),
    },
    {
      group: "vcu",
      field: "uptime",
      title: "Uptime",
      required: true,
      chartable: true,
      unit: "hour",
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)) / 3600,
      display: (vf) => Dot(vf, 2),
    },
    {
      group: "vcu",
      field: "batVoltage",
      title: "Battery Voltage",
      required: false,
      chartable: true,
      unit: "mVolt",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 18,
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu",
      field: "signal",
      title: "Signal Quality",
      required: false,
      chartable: true,
      unit: "%",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.trip",
      field: "odometer",
      title: "Odometer",
      required: false,
      chartable: true,
      unit: "Km",
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.gps",
      field: "gpsLongitude",
      title: "GPS Longitude",
      required: false,
      chartable: true,
      size: 4,
      format: (v) => HexToSignedInt32(cend(v)) * 0.0000001,
      display: (vf) => parseFloat(vf.toFixed(7)),
    },
    {
      group: "vcu.gps",
      field: "gpsLatitude",
      title: "GPS Latitude",
      required: false,
      chartable: true,
      size: 4,
      format: (v) => HexToSignedInt32(cend(v)) * 0.0000001,
      display: (vf) => parseFloat(vf.toFixed(7)),
    },
    {
      group: "vcu.gps",
      field: "gpsAltitude",
      title: "GPS Altitude",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: "vcu.gps",
      field: "gpsHDOP",
      title: "GPS HDOP",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: "vcu.gps",
      field: "gpsVDOP",
      title: "GPS VDOP",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: "vcu.gps",
      field: "gpsSpeed",
      title: "GPS Speed",
      required: false,
      chartable: true,
      unit: "Km/hr",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.gps",
      field: "gpsHeading",
      title: "GPS Heading",
      required: false,
      chartable: true,
      unit: "Degree",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 2,
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.gps",
      field: "gpsSatInUse",
      title: "GPS Sat. in use",
      required: false,
      chartable: true,
      unit: "Sat.",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.estimation",
      field: "rangeEstimation",
      title: "Range Estimation",
      required: false,
      chartable: true,
      unit: "Km",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.estimation",
      field: "batteryEstimation",
      title: "Battery Estimation",
      required: false,
      chartable: true,
      unit: "Km/kWh",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.trip",
      field: "tripA",
      title: "Trip A",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu.trip",
      field: "tripB",
      title: "Trip B",
      required: false,
      chartable: true,
      unit: "m",
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
  ];
};

const HMI1 = () => {
  return [
    {
      group: `hmi1`,
      field: `hmi1Run`,
      title: `HMI1 Run`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
  ];
};

const GYRO = () => {
  const GYRO_LIST = ["Yaw (U/D)", "Pitch (F/B)", "Roll (L/R)"];

  return GYRO_LIST.reduce((acc, gyro) => {
    return acc.concat([
      {
        group: `vcu.gyro`,
        field: `gyro${gyro}`,
        title: `Gyro ${gyro}`,
        required: false,
        chartable: true,
        unit: "Degree",
        size: 1,
        format: (v) => HexToSignedInt8(cend(v)),
        display: (vf) => Dot(vf),
      },
    ]);
  }, []);
};

const BMS = () => {
  return [
    {
      group: `bms`,
      field: `bmsActive`,
      title: `BMS Active`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `bms`,
      field: `bmsRun`,
      title: `BMS Run`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `bms`,
      field: `bmsSoc`,
      title: `BMS SOC`,
      required: false,
      chartable: true,
      unit: "%",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: `bms`,
      field: `bmsFault`,
      title: `BMS Fault`,
      required: false,
      chartable: true,
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => IntToHex(vf, 4).toUpperCase(),
    },
    ...["One", "Two"].reduce(
      (acc, i) =>
        acc.concat([
          {
            group: `bms.${i}`,
            field: `bms${i}Id`,
            title: `BMS ${i} ID`,
            required: false,
            size: 4,
            format: (v) => HexToUnsignedInt(cend(v)),
            display: (vf) => {
              if (vf === 0xffffffff) return "NONE";
              return IntToHex(vf, 8).toUpperCase();
            },
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Voltage`,
            title: `BMS ${i} Voltage`,
            required: false,
            chartable: true,
            unit: "Volt",
            size: 2,
            format: (v) => HexToUnsignedInt(cend(v)) * 0.01,
            display: (vf) => parseFloat(vf.toFixed(2)),
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Current`,
            title: `BMS ${i} Current`,
            required: false,
            chartable: true,
            unit: "Ampere",
            size: 2,
            format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
            display: (vf) => parseFloat(vf.toFixed(2)),
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Soc`,
            title: `BMS ${i} SoC`,
            required: false,
            chartable: true,
            unit: "%",
            size: 1,
            format: (v) => HexToUnsignedInt(cend(v)),
            display: (vf) => Dot(vf),
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Temperature`,
            title: `BMS ${i} Temperature`,
            required: false,
            chartable: true,
            unit: "Celcius",
            size: 2,
            format: (v) => HexToUnsignedInt(cend(v)),
            display: (vf) => parseFloat(vf.toFixed(2)),
          },
        ]),
      []
    ),
  ];
};

const MCU = () => {
  return [
    {
      group: `mcu`,
      field: `mcuActive`,
      title: `MCU Active`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `mcu`,
      field: `mcuRun`,
      title: `MCU Run`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `mcu`,
      field: `mcuRpm`,
      title: `MCU RPM`,
      required: false,
      chartable: true,
      unit: "rpm",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: `mcu`,
      field: `mcuSpeed`,
      title: `MCU Speed`,
      required: false,
      chartable: true,
      unit: "km/hr",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: `mcu`,
      field: `mcuReverse`,
      title: `MCU Reverse`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `mcu`,
      field: `mcuTemperature`,
      title: `MCU Temperature`,
      required: false,
      chartable: true,
      unit: "Celcius",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: "mcu",
      field: "mcuDriveMode",
      title: "MCU Drive Mode",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => config.mode.drive[vf],
    },
    {
      group: `mcu.fault`,
      field: `mcuFaultPost`,
      title: `MCU Fault Post`,
      required: false,
      chartable: true,
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => IntToHex(vf, 8).toUpperCase(),
    },
    {
      group: `mcu.fault`,
      field: `mcuFaultRun`,
      title: `MCU Fault Run`,
      required: false,
      chartable: true,
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => IntToHex(vf, 8).toUpperCase(),
    },
    {
      group: `mcu.torque`,
      field: `mcuTorqueCommand`,
      title: `MCU Torque Command`,
      required: false,
      chartable: true,
      unit: "Nm",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mcu.torque`,
      field: `mcuTorqueFeedback`,
      title: `MCU Torque Feedback`,
      required: false,
      chartable: true,
      unit: "Nm",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mcu.dcbus`,
      field: `mcuDcbusCurrent`,
      title: `MCU DCBus Current`,
      required: false,
      chartable: true,
      unit: "A",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mcu.dcbus`,
      field: `mcuDcbusVoltage`,
      title: `MCU DCBus Voltage`,
      required: false,
      chartable: true,
      unit: "V",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mcu.inverter`,
      field: `mcuInverterCanMode`,
      title: `MCU Inverter CAN Mode`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `mcu.inverter`,
      field: `mcuInverterEnabled`,
      title: `MCU Inverter Enabled`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `mcu.inverter`,
      field: `mcuInverterLockout`,
      title: `MCU Inverter Lockout`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `mcu.inverter`,
      field: `mcuInverterDischarge`,
      title: `MCU Inverter Discharge`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => {
        const states = [
          "DISABLED",
          "ENABLED",
          "CHECK",
          "OCCURING",
          "COMPLETED",
        ];
        return states[vf] ?? "Unknown";
      },
    },
    {
      group: "mcu.template",
      field: "mcuTemplateMaxSpeed",
      title: "MCU Template Max Speed",
      required: false,
      chartable: true,
      unit: "Km/hr",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    ...config.mode.drive.reduce((acc, m) => {
      return acc.concat([
        {
          group: `mcu.template`,
          field: `mcuTemplate${m}Discur`,
          title: `MCU Template ${m} Discur`,
          required: false,
          chartable: true,
          unit: "A",
          size: 2,
          format: (v) => HexToUnsignedInt(cend(v)),
          display: (vf) => Dot(vf),
        },
        {
          group: `mcu.template`,
          field: `mcuTemplate${m}Torque`,
          title: `MCU Template ${m} Torque`,
          required: false,
          chartable: true,
          unit: "Nm",
          size: 2,
          format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
          display: (vf) => parseFloat(vf.toFixed(2)),
        },
      ]);
    }, []),
  ];
};

const TASKS = () => {
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
    "canTxTask",
    // "hmi2PowerTask"
  ];

  return [
    ...TASK_LIST.reduce((acc, task) => {
      return acc.concat([
        {
          group: `task.stack`,
          field: `${task}Stack`,
          title: `${startCase(task)} stack`,
          required: false,
          chartable: true,
          unit: "Bytes",
          size: 2,
          format: (v) => HexToUnsignedInt(cend(v)),
          display: (vf) => Dot(vf),
        },
      ]);
    }, []),
    ...TASK_LIST.reduce((acc, task) => {
      return acc.concat([
        {
          group: `task.wakeup`,
          field: `${task}Wakeup`,
          title: `${startCase(task)} wakeup`,
          required: false,
          chartable: true,
          unit: "s",
          size: 1,
          format: (v) => HexToUnsignedInt(cend(v)),
          display: (vf) => {
            let prefix = vf < 255 ? "<" : ">";
            return `${prefix} ${Dot(vf)}`;
          },
        },
      ]);
    }, []),
  ];
};

const Report = [
  ...Header,
  ...VCU(),
  ...GYRO(),
  ...HMI1(),
  ...BMS(),
  ...MCU(),
  ...TASKS(),
].map((el, idx) => ({
  ...el,
  no: idx,
}));

export { VEHICLE_STATES, Report };
