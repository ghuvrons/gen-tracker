import dayjs from "src/js/dayjs";
import config from "src/data/config";
import { startCase } from "lodash";
import { parseDatetime } from "src/js/utils";
import { Header } from "src/data/header";
import {
  cend,
  HexToUnsignedInt,
  HexToSignedInt8,
  HexToSignedInt32,
  IntToHex,
  Dot,
  HexToSignedInt16,
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
      display: (vf) => `${config.frames[vf]} (${vf})`,
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
      field: "state",
      title: "State",
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToSignedInt8(cend(v)),
      display: (vf) => {
        const vState =
          Object.keys(VEHICLE_STATES)[
            Object.values(VEHICLE_STATES).findIndex((s) => s === parseInt(vf))
          ];

        return `${vState} (${vf})`;
      },
    },
    {
      group: "vcu",
      field: "events",
      title: "Events",
      required: true,
      chartable: true,
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => IntToHex(vf, 4),
    },
    {
      group: "vcu",
      field: "logBuffered",
      title: "Log Buffered",
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "vcu",
      field: "batVoltage",
      title: "Bat. Voltage",
      required: true,
      chartable: true,
      unit: "mVolt",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 18,
      display: (vf) => Dot(vf),
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
  ];
};

const EEPROM = () => {
  return [
    {
      group: `eeprom`,
      field: `eepromActive`,
      title: `EEPROM Active`,
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: "eeprom",
      field: "eepromUsed",
      title: "EEPROM Used",
      required: true,
      chartable: true,
      unit: "%",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
  ];
};

const GPS = () => {
  return [
    {
      group: `gps`,
      field: `gpsActive`,
      title: `GPS Active`,
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: "gps",
      field: "gpsSatInUse",
      title: "GPS Sat. in use",
      required: true,
      chartable: true,
      unit: "Sat.",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "gps",
      field: "gpsHDOP",
      title: "GPS HDOP",
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: "gps",
      field: "gpsVDOP",
      title: "GPS VDOP",
      required: true,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: "gps",
      field: "gpsSpeed",
      title: "GPS Speed",
      required: true,
      chartable: true,
      unit: "Kph",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "gps",
      field: "gpsHeading",
      title: "GPS Heading",
      required: true,
      chartable: true,
      unit: "Deg",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)) * 2,
      display: (vf) => Dot(vf),
    },
    {
      group: "gps",
      field: "gpsLongitude",
      title: "GPS Longitude",
      required: true,
      chartable: true,
      size: 4,
      format: (v) => HexToSignedInt32(cend(v)) * 0.0000001,
      display: (vf) => parseFloat(vf.toFixed(7)),
    },
    {
      group: "gps",
      field: "gpsLatitude",
      title: "GPS Latitude",
      required: true,
      chartable: true,
      size: 4,
      format: (v) => HexToSignedInt32(cend(v)) * 0.0000001,
      display: (vf) => parseFloat(vf.toFixed(7)),
    },
    {
      group: "gps",
      field: "gpsAltitude",
      title: "GPS Altitude",
      required: true,
      chartable: true,
      unit: "m",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
  ];
};

const HBAR = () => {
  return [
    {
      group: `hbar`,
      field: `hbarReverse`,
      title: `HBAR Reverse`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: "hbar.mode",
      field: "modeDrive",
      title: "Mode Drive",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => `${config.mode.drive[vf]} (${vf})`,
    },
    {
      group: "hbar.mode",
      field: "modeTrip",
      title: "Mode Trip",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => `${config.mode.trip[vf]} (${vf})`,
    },
    {
      group: "hbar.mode",
      field: "modeAverage",
      title: "Mode Average",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => `${config.mode.average[vf]} (${vf})`,
    },
    {
      group: "hbar.trip",
      field: "tripA",
      title: "Trip A",
      required: false,
      chartable: true,
      unit: "Km",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "hbar.trip",
      field: "tripB",
      title: "Trip B",
      required: false,
      chartable: true,
      unit: "Km",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "hbar.trip",
      field: "odo",
      title: "ODO",
      required: false,
      chartable: true,
      unit: "Km",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "hbar.average",
      field: "rangeAverage",
      title: "Range Average",
      required: false,
      chartable: true,
      unit: "Km",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "hbar.average",
      field: "efficiencyAverage",
      title: "Efficiency Average",
      required: false,
      chartable: true,
      unit: "Km/kWh",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
  ];
};

const NET = () => {
  return [
    {
      group: "net",
      field: "netSignal",
      title: "Net Signal",
      required: false,
      chartable: true,
      unit: "%",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "net",
      field: "netState",
      title: "Net State",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToSignedInt8(cend(v)),
      display: (vf) => {
        const states = [
          "DOWN",
          "READY",
          "CONFIGURED",
          "NETWORK_ON",
          "GPRS_ON",
          "PDP_ON",
          "INTERNET_ON",
          "SERVER_ON",
          "MQTT_ON",
        ];

        return `${states[vf + 1]} (${vf})`;
      },
    },
    {
      group: "net",
      field: "netIpStatus",
      title: "Net IpStatus",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToSignedInt8(cend(v)),
      display: (vf) => {
        const ipStatus = [
          "UNKNOWN",
          "IP_INITIAL",
          "IP_START",
          "IP_CONFIG",
          "IP_GPRSACT",
          "IP_STATUS",
          "CONNECTING",
          "CONNECT_OK",
          "CLOSING",
          "CLOSED",
          "PDP_DEACT",
        ];
        return `${ipStatus[vf + 1]} (${vf})`;
      },
    },
  ];
};

const MEMS = () => {
  const AXIS = ["X", "Y", "Z"];

  return [
    {
      group: `mems`,
      field: `memsActive`,
      title: `MEMS Active`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `mems`,
      field: `memsMotion`,
      title: `MEMS Motion`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "Enabled" : "Disabled"),
    },
    ...AXIS.reduce((acc, axis) => {
      return acc.concat([
        {
          group: `mems.accel`,
          field: `memsAccel${axis}`,
          title: `MEMS Accel ${axis}`,
          required: false,
          chartable: true,
          unit: "G",
          size: 2,
          format: (v) => HexToSignedInt16(cend(v)) * 0.01,
          display: (vf) => parseFloat(vf.toFixed(2)),
        },
      ]);
    }, []),
    ...AXIS.reduce((acc, axis) => {
      return acc.concat([
        {
          group: `mems.gyro`,
          field: `memsGyro${axis}`,
          title: `MEMS Gyro ${axis}`,
          required: false,
          chartable: true,
          unit: "rad/s",
          size: 2,
          format: (v) => HexToSignedInt16(cend(v)) * 0.1,
          display: (vf) => parseFloat(vf.toFixed(2)),
        },
      ]);
    }, []),
    ...["Pitch", "Roll"].reduce((acc, axis) => {
      return acc.concat([
        {
          group: `mems.tilt`,
          field: `memsTilt${axis}`,
          title: `MEMS Tilt ${axis}`,
          required: false,
          chartable: true,
          unit: "Deg",
          size: 2,
          format: (v) => HexToSignedInt16(cend(v)) * 0.1,
          display: (vf) => parseFloat(vf.toFixed(2)),
        },
      ]);
    }, []),
    {
      group: `mems.total`,
      field: `memsTotalAccel`,
      title: `MEMS Total Accel`,
      required: false,
      chartable: true,
      unit: "G",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.01,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mems.total`,
      field: `memsTotalGyro`,
      title: `MEMS Total Gyro`,
      required: false,
      chartable: true,
      unit: "rad/s",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mems.total`,
      field: `memsTotalTilt`,
      title: `MEMS Total Tilt`,
      required: false,
      chartable: true,
      unit: "Deg",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mems.total`,
      field: `memsTotalTemp`,
      title: `MEMS Total Temp`,
      required: false,
      chartable: true,
      unit: "Celcius",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
  ];
};

const REMOTE = () => {
  return [
    {
      group: `remote`,
      field: `remoteActive`,
      title: `Remote Active`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `remote`,
      field: `remoteNearby`,
      title: `Remote Nearby`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
  ];
};

const FINGER = () => {
  return [
    {
      group: `finger`,
      field: `fingerVerified`,
      title: `Finger Verified`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: "finger",
      field: "fingerDriverID",
      title: "Finger Driver ID",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => {
        if (vf === 0) return "NONE";
        return IntToHex(vf, 2);
      },
    },
  ];
};

const AUDIO = () => {
  return [
    {
      group: `audio`,
      field: `audioActive`,
      title: `Audio Active`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `audio`,
      field: `audioMute`,
      title: `Audio Mute`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: `audio`,
      field: `audioVolume`,
      title: `Audio Volume`,
      required: false,
      chartable: true,
      unit: "%",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
  ];
};

const HMI1 = () => {
  return [
    {
      group: `hmi1`,
      field: `hmi1Active`,
      title: `HMI1 Active`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
  ];
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
      display: (vf) => IntToHex(vf, 4),
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
              return IntToHex(vf, 8);
            },
          },
          {
            group: `bms.${i}`,
            field: `bms${i}Fault`,
            title: `BMS ${i} Fault`,
            required: false,
            chartable: true,
            size: 2,
            format: (v) => HexToUnsignedInt(cend(v)),
            display: (vf) => IntToHex(vf, 4),
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
            field: `bms${i}Temp`,
            title: `BMS ${i} Temp`,
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
      field: `mcuReverse`,
      title: `MCU Reverse`,
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => (vf ? "YES" : "NO"),
    },
    {
      group: "mcu",
      field: "mcuDriveMode",
      title: "MCU Drive Mode",
      required: false,
      chartable: true,
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => `${config.mode.drive[vf]} (${vf})`,
    },
    {
      group: `mcu`,
      field: `mcuSpeed`,
      title: `MCU Speed`,
      required: false,
      chartable: true,
      unit: "Kph",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: `mcu`,
      field: `mcuRpm`,
      title: `MCU RPM`,
      required: false,
      chartable: true,
      unit: "rpm",
      size: 2,
      format: (v) => HexToSignedInt16(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: `mcu`,
      field: `mcuTemp`,
      title: `MCU Temp`,
      required: false,
      chartable: true,
      unit: "Celcius",
      size: 2,
      format: (v) => HexToUnsignedInt(cend(v)) * 0.1,
      display: (vf) => parseFloat(vf.toFixed(2)),
    },
    {
      group: `mcu.fault`,
      field: `mcuFaultPost`,
      title: `MCU Fault Post`,
      required: false,
      chartable: true,
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => IntToHex(vf, 8),
    },
    {
      group: `mcu.fault`,
      field: `mcuFaultRun`,
      title: `MCU Fault Run`,
      required: false,
      chartable: true,
      size: 4,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => IntToHex(vf, 8),
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
        return `${states[vf]} (${vf})`;
      },
    },
    {
      group: `mcu.template`,
      field: `mcuTemplateMaxRpm`,
      title: `MCU Template Max RPM`,
      required: false,
      chartable: true,
      unit: "rpm",
      size: 2,
      format: (v) => HexToSignedInt16(cend(v)),
      display: (vf) => Dot(vf),
    },
    {
      group: "mcu.template",
      field: "mcuTemplateMaxSpeed",
      title: "MCU Template Max Speed",
      required: false,
      chartable: true,
      unit: "Kph",
      size: 1,
      format: (v) => HexToUnsignedInt(cend(v)),
      display: (vf) => Dot(vf),
    },
    ...config.mode.drive.reduce((acc, m) => {
      return acc.concat([
        {
          group: `mcu.template.${m}`,
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
          group: `mcu.template.${m}`,
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
    "networkTask",
    "reporterTask",
    "commandTask",
    "memsTask",
    "remoteTask",
    "fingerTask",
    "audioTask",
    "gateTask",
    "canRxTask",
    "canTxTask",
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
  ...EEPROM(),
  ...GPS(),

  ...HBAR(),
  ...NET(),
  ...MEMS(),
  ...REMOTE(),
  ...FINGER(),
  ...AUDIO(),

  ...HMI1(),
  ...BMS(),
  ...MCU(),
  ...TASKS(),
].map((el, idx) => ({
  ...el,
  no: idx,
}));

export { VEHICLE_STATES, Report };
