import { CommandHeader } from "src/data/header";
import { IntToHex, cend, AsciiToHex } from "src/js/formatter";
import validator from "./validator";
import formatter, { TimeStamp } from "./formatter";
import config from "./config";

const CMDC = {
  GEN: 0,
  OVD: 1,
  AUDIO: 2,
  FGR: 3,
  RMT: 4,
  FOTA: 5,
  NET: 6,
  CON: 7,
  HBAR: 8,
  MCU: 9,
};

const Command = [
  ...CommandHeader,
  {
    field: "value",
    title: "Value",
    size: 200,
    format: (v) => v,
    display: (vf) => vf,
    formatCmd: (v, sz) => cend(IntToHex(parseInt(v ?? 0), (sz ?? 0) * 2)),
  },
];

const COMMAND_LIST = [
  {
    command: "GEN_INFO",
    desc: "Gather device information",
    code: CMDC.GEN,
    subCode: 0,
  },
  {
    command: "GEN_LED",
    desc: "Set system led",
    code: CMDC.GEN,
    subCode: 1,
    size: 1,
    type: "bool",
    range: [0, 1],
  },
  {
    command: "GEN_RTC",
    desc: "Set datetime (d[1-7])",
    code: CMDC.GEN,
    subCode: 2,
    size: 7,
    type: "uint8_t",
    range: ["YYMMDDHHmmss0d"],
    validator: (v) => validator.GEN.RTC(v),
    formatCmd: (v) => TimeStamp(v),
  },
  {
    command: "GEN_ODO",
    desc: "Set odometer (km)",
    code: CMDC.GEN,
    subCode: 3,
    size: 2,
    type: "uint16_t",
    range: [0, 65535],
  },
  {
    command: "GEN_ANTITHIEF",
    desc: "Toggle anti-thief motion detector",
    code: CMDC.GEN,
    subCode: 4,
  },
  {
    command: "GEN_RPT_FLUSH",
    desc: "Flush report buffer",
    code: CMDC.GEN,
    subCode: 5,
  },
  {
    command: "GEN_RPT_BLOCK",
    desc: "Block report buffer",
    code: CMDC.GEN,
    subCode: 6,
    size: 1,
    type: "bool",
    range: [0, 1],
  },
  {
    command: "OVD_STATE",
    desc: "Override vehicle state",
    code: CMDC.OVD,
    subCode: 0,
    size: 1,
    type: "uint8_t",
    range: [0, 3],
  },
  {
    command: "OVD_RPT_INTERVAL",
    desc: "Override report interval",
    code: CMDC.OVD,
    subCode: 1,
    size: 2,
    type: "uint16_t",
    range: [0, 65535],
  },
  {
    command: "OVD_RPT_FRAME",
    desc: "Override report frame",
    code: CMDC.OVD,
    subCode: 2,
    size: 1,
    type: "uint8_t",
    range: [0, 2],
  },
  {
    command: "OVD_RMT_SEAT",
    desc: "Override remote seat button",
    code: CMDC.OVD,
    subCode: 3,
  },
  {
    command: "OVD_RMT_ALARM",
    desc: "Override remote alarm button",
    code: CMDC.OVD,
    subCode: 4,
  },
  {
    command: "AUDIO_BEEP",
    desc: "Beep the audio module",
    code: CMDC.AUDIO,
    subCode: 0,
  },
  {
    command: "FINGER_FETCH",
    desc: "Get all registered id",
    code: CMDC.FGR,
    subCode: 0,
    timeout: 15,
  },
  {
    command: "FINGER_ADD",
    desc: "Add a new fingerprint",
    code: CMDC.FGR,
    subCode: 1,
    timeout: 20,
  },
  {
    command: "FINGER_DEL",
    desc: "Delete a fingerprint",
    code: CMDC.FGR,
    subCode: 2,
    size: 1,
    type: "uint8_t",
    range: [1, 5],
    timeout: 15,
  },
  {
    command: "FINGER_RST",
    desc: "Reset all fingerprints",
    code: CMDC.FGR,
    subCode: 3,
    timeout: 15,
  },
  {
    command: "REMOTE_PAIRING",
    desc: "Keyless pairing mode",
    code: CMDC.RMT,
    subCode: 0,
    timeout: 15,
  },
  {
    command: "FOTA_VCU",
    desc: "Upgrade VCU firmware",
    code: CMDC.FOTA,
    subCode: 0,
    timeout: 6 * 60,
  },
  {
    command: "FOTA_HMI",
    desc: "Upgrade HMI firmware",
    code: CMDC.FOTA,
    subCode: 1,
    timeout: 12 * 60,
  },
  {
    command: "NET_SEND_USSD",
    desc: "Send USSD (ex: *123*10*3#)",
    code: CMDC.NET,
    subCode: 0,
    size: 20,
    type: "char",
    validator: (v) => validator.NET.SEND_USSD(v),
    formatCmd: (v) => AsciiToHex(v),
  },
  {
    command: "NET_READ_SMS",
    desc: "Read last SMS",
    code: CMDC.NET,
    subCode: 1,
  },
  {
    command: "CON_APN",
    desc: "Set APN connection (ex: 3gprs;3gprs;3gprs)",
    code: CMDC.CON,
    subCode: 0,
    range: [
      [1, 30],
      [1, 30],
      [1, 30],
    ],
    size: 3 * 30,
    type: "[char name, user, pass][3]",
    validator: (v) => validator.CON(v, 3),
    formatCmd: (v) => AsciiToHex(v),
  },
  {
    command: "CON_FTP",
    desc: "Set FTP connection",
    code: CMDC.CON,
    subCode: 1,
    range: [
      [1, 30],
      [1, 30],
      [1, 30],
    ],
    size: 3 * 30,
    type: "[char host, user, pass][3]",
    validator: (v) => validator.CON(v, 3),
    formatCmd: (v) => AsciiToHex(v),
  },
  {
    command: "CON_MQTT",
    desc: "Set MQTT connection",
    code: CMDC.CON,
    subCode: 2,
    range: [
      [1, 30],
      [1, 30],
      [1, 30],
      [1, 30],
    ],
    size: 4 * 30,
    type: "[char host, port, user, pass][4]",
    validator: (v) => validator.CON(v, 4),
    formatCmd: (v) => AsciiToHex(v),
  },
  {
    command: "HBAR_DRIVE",
    desc: "Set handlebar drive mode",
    code: CMDC.HBAR,
    subCode: 0,
    size: 1,
    type: "uint8_t",
    range: [0, 2],
  },
  {
    command: "HBAR_TRIP",
    desc: "Set handlebar trip mode",
    code: CMDC.HBAR,
    subCode: 1,
    size: 1,
    type: "uint8_t",
    range: [0, 2],
  },
  {
    command: "HBAR_REPORT",
    desc: "Set handlebar report mode",
    code: CMDC.HBAR,
    subCode: 2,
    size: 1,
    type: "uint8_t",
    range: [0, 1],
  },
  {
    command: "HBAR_REVERSE",
    desc: "Set handlebar reverse state",
    code: CMDC.HBAR,
    subCode: 3,
    size: 1,
    type: "uint8_t",
    range: [0, 1],
  },
  {
    command: "MCU_SPEED_MAX",
    desc: "Set MCU max speed",
    code: CMDC.MCU,
    subCode: 0,
    size: 1,
    type: "uint8_t",
    range: [0, 255],
  },
  {
    command: "MCU_TEMPLATES",
    desc: "Set MCU templates (ex: 50,15;50,20;50,25)",
    code: CMDC.MCU,
    subCode: 1,
    range: [
      [1, 32767],
      [1, 3276],
    ],
    size: 4 * config.mode.drive.length,
    type: "[uint16_t discur, torque][3]",
    validator: (v) => validator.MCU.TEMPLATES(v),
    formatCmd: (v) => formatter.MCU.TEMPLATES(v),
  },
];

export { COMMAND_LIST, Command };
