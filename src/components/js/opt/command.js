import { CommandHeader } from "components/js/opt/header";
import { IntToHex, ChangeEndian } from "components/js/helper";

const COMMAND_LIST = [
  {
    command: "GEN_INFO",
    desc: "Get VCU firmware information",
    code: 0,
    subCode: 0,
  },
  {
    command: "GEN_LED",
    desc: "Set test LED value",
    code: 0,
    subCode: 1,
    type: "Bool",
    range: [0, 1],
  },
  {
    command: "GEN_OVERRIDE",
    desc: "Override the vehicle state",
    code: 0,
    subCode: 2,
    type: "I8",
    range: [1, 3],
  },
  {
    command: "GEN_UPGRADE_VCU",
    desc: "Upgrade VCU firmware",
    code: 0,
    subCode: 3,
    timeout: 5 * 60000,
  },
  {
    command: "GEN_UPGRADE_HMI",
    desc: "Upgrade HMI firmware",
    code: 0,
    subCode: 4,
    timeout: 10 * 60000,
  },
  {
    command: "REPORT_RTC",
    desc: "Set RTC value ( E start from 1=Monday )",
    code: 1,
    subCode: 0,
    type: "U64",
    range: ["YYMMDDHHmmssE"],
  },
  {
    command: "REPORT_ODOM",
    desc: "Set odometer value",
    code: 1,
    subCode: 1,
    type: "U32",
    range: [0, 99999],
  },
  {
    command: "REPORT_UNITID",
    desc: "Set unit ID of VCU",
    code: 1,
    subCode: 2,
    type: "U32",
    range: [0, 4294967295],
  },
  {
    command: "AUDIO_BEEP",
    desc: "Set beep the audio module",
    code: 2,
    subCode: 0,
  },
  {
    command: "AUDIO_MUTE",
    desc: "Set the audio module mute mode",
    code: 2,
    subCode: 1,
    type: "Bool",
    range: [0, 1],
  },
  {
    command: "AUDIO_VOL",
    desc: "Change audio module volume",
    code: 2,
    subCode: 2,
    type: "U8",
    range: [0, 100],
  },
  {
    command: "FINGER_ADD",
    desc: "Add new fingerprint to specified ID",
    code: 3,
    subCode: 0,
    type: "U8",
    range: ["AA", "ZZ"],
    timeout: 30000,
  },
  {
    command: "FINGER_DEL",
    desc: "Delete fingerprint with specified ID",
    code: 3,
    subCode: 1,
    type: "U8",
    range: [0, 4],
  },
  {
    command: "FINGER_RST",
    desc: "Delete all saved fingerprint ID",
    code: 3,
    subCode: 2,
  },
  {
    command: "KEYLESS_PAIRING",
    desc: "Pairing Pocket Keyless",
    code: 4,
    subCode: 0,
  },
];

const Command = [
  ...CommandHeader,
  {
    field: "code",
    title: "Code",
    size: 1,
    format: (val) => ChangeEndian(IntToHex(val, 1 * 2)),
  },
  {
    field: "subCode",
    title: "Sub Code",
    size: 1,
    format: (val) => ChangeEndian(IntToHex(val, 1 * 2)),
  },
  {
    field: "value",
    title: "Value",
    size: 8,
    format: (val) => ChangeEndian(IntToHex(parseInt(val), 8 * 2)),
  },
];

export { COMMAND_LIST, Command };
