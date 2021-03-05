import { Header } from "src/js/opt/header";
import { IntToHex, ChangeEndian } from "src/js/formatter";
import { buildTimestamp } from "src/js/utils";
import dayjs from "src/js/dayjs";

const Command = [
  ...Header,
  {
    field: "code",
    title: "Code",
    size: 1,
    formatCmd: v => ChangeEndian(IntToHex(v, 1 * 2))
  },
  {
    field: "subCode",
    title: "Sub Code",
    size: 1,
    formatCmd: v => ChangeEndian(IntToHex(v, 1 * 2))
  },
  {
    field: "value",
    title: "Value",
    size: 200,
    formatCmd: (v, sz) =>
      ChangeEndian(IntToHex(parseInt(v || 0), (sz || 0) * 2))
  }
];

const COMMAND_LIST = [
  {
    command: "GEN_INFO",
    desc: "Gather device information",
    code: 0,
    subCode: 0
  },
  {
    command: "GEN_QUOTA",
    desc: "Check internet quota",
    code: 0,
    subCode: 1,
    timeout: 30
  },
  {
    command: "GEN_LED",
    desc: "Control system led",
    code: 0,
    subCode: 2,
    size: 1,
    type: "bool",
    range: [0, 1]
  },
  {
    command: "GEN_OVERRIDE",
    desc: "Override vehicle state",
    code: 0,
    subCode: 3,
    size: 1,
    type: "uint8_t",
    range: [1, 3]
  },
  {
    command: "REPORT_RTC",
    desc: "Set datetime ( d [0=Sunday] )",
    code: 1,
    subCode: 0,
    size: 7,
    type: "uint8_t[7]",
    range: ["YYMMDDHHmmss0d"],
    formatCmd: v => buildTimestamp(v),
    validator: v => dayjs(v, "YYMMDDHHmmss0d", true).isValid()
  },
  {
    command: "REPORT_ODOM",
    desc: "Set odometer (km)",
    code: 1,
    subCode: 1,
    size: 4,
    type: "uint32_t",
    range: [0, 99999]
  },
  {
    command: "AUDIO_BEEP",
    desc: "Beep the audio module",
    code: 2,
    subCode: 0
  },
  {
    command: "AUDIO_MUTE",
    desc: "Mute the audio module",
    code: 2,
    subCode: 1,
    size: 1,
    type: "bool",
    range: [0, 1]
  },
  {
    command: "FINGER_FETCH",
    desc: "Get all registered id",
    code: 3,
    subCode: 0,
    timeout: 15
  },
  {
    command: "FINGER_ADD",
    desc: "Add a new fingerprint",
    code: 3,
    subCode: 1,
    timeout: 20
  },
  {
    command: "FINGER_DEL",
    desc: "Delete a fingerprint",
    code: 3,
    subCode: 2,
    size: 1,
    type: "uint8_t",
    range: [1, 5],
    timeout: 15
  },
  {
    command: "FINGER_RST",
    desc: "Reset all fingerprints",
    code: 3,
    subCode: 3,
    timeout: 15
  },
  {
    command: "REMOTE_PAIRING",
    desc: "Keyless pairing mode",
    code: 4,
    subCode: 0,
    timeout: 15
  },
  {
    command: "REMOTE_UNITID",
    desc: "Set device unique id",
    code: 4,
    subCode: 1,
    size: 4,
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

export { COMMAND_LIST, Command };
