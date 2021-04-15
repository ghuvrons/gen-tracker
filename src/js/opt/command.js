import { CommandHeader } from "src/js/opt/header";
import { IntToHex, cend, AsciiToHex } from "src/js/formatter";
import { buildTimestamp } from "src/js/utils";
import dayjs from "src/js/dayjs";
import config from "./config";

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
    code: 0,
    subCode: 0,
  },
  {
    command: "GEN_LED",
    desc: "Set system led",
    code: 0,
    subCode: 1,
    size: 1,
    type: "bool",
    range: [0, 1],
  },
  {
    command: "GEN_RTC",
    desc: "Set datetime (d[1-7])",
    code: 0,
    subCode: 2,
    size: 7,
    type: "uint8_t",
    range: ["YYMMDDHHmmss0d"],
    formatCmd: (v) => buildTimestamp(v),
    validator: (v) => dayjs(v, "YYMMDDHHmmss0d", true).isValid(),
  },
  {
    command: "GEN_ODOM",
    desc: "Set odometer (km)",
    code: 0,
    subCode: 3,
    size: 2,
    type: "uint16_t",
    range: [0, 65535],
  },
  {
    command: "GEN_RST_LOG",
    desc: "Reset log buffer",
    code: 0,
    subCode: 4,
  },
  {
    command: "OVERRIDE_STATE",
    desc: "Override vehicle state",
    code: 1,
    subCode: 0,
    size: 1,
    type: "uint8_t",
    range: [0, 3],
  },
  {
    command: "OVERRIDE_RPT_INTERVAL",
    desc: "Override report interval",
    code: 1,
    subCode: 1,
    size: 2,
    type: "uint16_t",
    range: [0, 65535],
  },
  {
    command: "OVERRIDE_RPT_FRAME",
    desc: "Override report frame",
    code: 1,
    subCode: 2,
    size: 1,
    type: "uint8_t",
    range: [0, 2],
  },
  {
    command: "OVERRIDE_RMT_SEAT",
    desc: "Override remote seat button",
    code: 1,
    subCode: 3,
  },
  {
    command: "OVERRIDE_RMT_ALARM",
    desc: "Override remote alarm button",
    code: 1,
    subCode: 4,
  },
  {
    command: "AUDIO_BEEP",
    desc: "Beep the audio module",
    code: 2,
    subCode: 0,
  },
  {
    command: "FINGER_FETCH",
    desc: "Get all registered id",
    code: 3,
    subCode: 0,
    timeout: 15,
  },
  {
    command: "FINGER_ADD",
    desc: "Add a new fingerprint",
    code: 3,
    subCode: 1,
    timeout: 20,
  },
  {
    command: "FINGER_DEL",
    desc: "Delete a fingerprint",
    code: 3,
    subCode: 2,
    size: 1,
    type: "uint8_t",
    range: [1, 5],
    timeout: 15,
  },
  {
    command: "FINGER_RST",
    desc: "Reset all fingerprints",
    code: 3,
    subCode: 3,
    timeout: 15,
  },
  {
    command: "REMOTE_PAIRING",
    desc: "Keyless pairing mode",
    code: 4,
    subCode: 0,
    timeout: 15,
  },
  {
    command: "FOTA_VCU",
    desc: "Upgrade VCU firmware",
    code: 5,
    subCode: 0,
    timeout: 6 * 60,
  },
  {
    command: "FOTA_HMI",
    desc: "Upgrade HMI firmware",
    code: 5,
    subCode: 1,
    timeout: 12 * 60,
  },
  {
    command: "NET_SEND_USSD",
    desc: "Send USSD (ex: *123*10*3#)",
    code: 6,
    subCode: 0,
    size: 20,
    type: "char",
    formatCmd: (v) => AsciiToHex(v),
    validator: (v) => v.length < 20 && v.startsWith("*") && v.endsWith("#"),
  },
  {
    command: "NET_READ_SMS",
    desc: "Read last SMS",
    code: 6,
    subCode: 1,
  },
  {
    command: "HBAR_DRIVE",
    desc: "Set handlebar drive mode",
    code: 7,
    subCode: 0,
    size: 1,
    type: "uint8_t",
    range: [0, 2],
  },
  {
    command: "HBAR_TRIP",
    desc: "Set handlebar trip mode",
    code: 7,
    subCode: 1,
    size: 1,
    type: "uint8_t",
    range: [0, 2],
  },
  {
    command: "HBAR_REPORT",
    desc: "Set handlebar report mode",
    code: 7,
    subCode: 2,
    size: 1,
    type: "uint8_t",
    range: [0, 1],
  },
  {
    command: "HBAR_REVERSE",
    desc: "Set handlebar reverse state",
    code: 7,
    subCode: 3,
    size: 1,
    type: "uint8_t",
    range: [0, 1],
  },
  {
    command: "MCU_SPEED_MAX",
    desc: "Set MCU max speed",
    code: 8,
    subCode: 0,
    size: 1,
    type: "uint8_t",
    range: [0, 255],
  },
  {
    command: "MCU_TEMPLATES",
    desc: "Set MCU templates",
    code: 8,
    subCode: 1,
    range: [
      [1, 32767],
      [1, 3276],
    ],
    size: 4 * config.mode.drive.length,
    type: "[uint16_t discur, uint16_t torque][3]",
    formatCmd: (v) => {
      let hex = "";
      // const templates = v.split(/[\[\]]+/).filter((e) => e);
      const templates = v.split(";");

      for (let i = 0; i < templates.length; i++) {
        const params = templates[i].split(",");

        for (let j = 0; j < params.length; j++) {
          hex += cend(IntToHex(parseInt(params[j]), 4));
        }
      }
      return hex;
    },
    validator: (v) => {
      const maxVal = [32767, 3276];
      // const templates = v.split(/[\[\]]+/).filter((e) => e);
      const templates = v.split(";");

      if (templates.length != config.mode.drive.length) return;
      for (let i = 0; i < templates.length; i++) {
        const params = templates[i].split(",");

        if (params.length != 2) return;
        for (let j = 0; j < params.length; j++) {
          const val = parseInt(params[j]);

          if (isNaN(val)) return;
          if (val < 1 || val > maxVal[j]) return;
        }
      }
      return true;
    },
  },
];

export { COMMAND_LIST, Command };
