import { Header } from "src/js/opt/header";
import { IntToHex, ChangeEndian } from "src/js/helper";
import { buildTimestamp } from "src/js/utils";
import moment from "moment";

const COMMAND_LIST = [
  {
    command: "GEN_INFO",
    desc: "Get VCU firmware information",
    code: 0,
    subCode: 0
  },
  {
    command: "GEN_QUOTA",
    desc: "Check internet quota",
    code: 0,
    subCode: 1
  },
  {
    command: "GEN_LED",
    desc: "Set test LED value",
    code: 0,
    subCode: 2,
    type: "bool",
    range: [0, 1]
  },
  {
    command: "GEN_OVERRIDE",
    desc: "Override the vehicle state",
    code: 0,
    subCode: 3,
    type: "uint8_t",
    range: [1, 3]
  },
  {
    command: "REPORT_RTC",
    desc: "Set RTC value ( E start from 1=Monday )",
    code: 1,
    subCode: 0,
    type: "uint8_t[7]",
    range: ["YYMMDDHHmmss0E"],
    formatCmd: val => buildTimestamp(val),
    validator: val => moment(val, "YYMMDDHHmmss0E").isValid()
  },
  {
    command: "REPORT_ODOM",
    desc: "Set odometer value (km)",
    code: 1,
    subCode: 1,
    type: "uint32_t",
    range: [0, 99999]
  },
  {
    command: "AUDIO_BEEP",
    desc: "Set beep the audio module",
    code: 2,
    subCode: 0
  },
  {
    command: "AUDIO_MUTE",
    desc: "Set the audio module mute mode",
    code: 2,
    subCode: 1,
    type: "bool",
    range: [0, 1]
  },
  {
    command: "FINGER_FETCH",
    desc: "Get all registered id",
    code: 3,
    subCode: 0,
    timeout: 10
  },
  {
    command: "FINGER_ADD",
    desc: "Add new fingerprint",
    code: 3,
    subCode: 1,
    timeout: 20
  },
  {
    command: "FINGER_DEL",
    desc: "Delete fingerprint ID",
    code: 3,
    subCode: 2,
    type: "uint8_t",
    range: [1, 5],
    timeout: 10
  },
  {
    command: "FINGER_RST",
    desc: "Reset all saved fingerprint ID",
    code: 3,
    subCode: 3,
    timeout: 10
  },
  {
    command: "REMOTE_PAIRING",
    desc: "Pairing pocket keyless",
    code: 4,
    subCode: 0,
    timeout: 10
  },
  {
    command: "REMOTE_UNITID",
    desc: "Set unit ID of VCU",
    code: 4,
    subCode: 1,
    type: "uint32_t",
    range: [0, 4294967295]
  },
  {
    command: "FOTA_VCU",
    desc: "Upgrade VCU firmware",
    code: 5,
    subCode: 0,
    timeout: 6 * 60
  },
  {
    command: "FOTA_HMI",
    desc: "Upgrade HMI firmware",
    code: 5,
    subCode: 1,
    timeout: 12 * 60
  }
];

const Command = [
  ...Header,
  {
    field: "code",
    title: "Code",
    size: 1,
    formatCmd: val => ChangeEndian(IntToHex(val, 1 * 2))
  },
  {
    field: "subCode",
    title: "Sub Code",
    size: 1,
    formatCmd: val => ChangeEndian(IntToHex(val, 1 * 2))
  },
  {
    field: "value",
    title: "Value",
    size: 8,
    formatCmd: val => ChangeEndian(IntToHex(parseInt(val), 8 * 2))
  }
];

export { COMMAND_LIST, Command };
