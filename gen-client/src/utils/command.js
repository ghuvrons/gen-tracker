import { config } from "./config";
import { Header } from "./frame";
import {
  AsciiToHex,
  HexToUnsignedInt,
  HexToAscii,
  IntToHex,
  CRC32,
  ChangeEndian
} from "./helper";

const CommandResponse = [
  {
    code: 0,
    name: "error",
    title: "ERROR",
    color: "red"
  },
  {
    code: 1,
    name: "ok",
    title: "OK",
    color: "green"
  },
  {
    code: 2,
    name: "invalid",
    title: "INVALID",
    color: "blue"
  },
  {
    code: 256,
    name: "timeout",
    title: "TIMEOUT",
    color: "orange"
  },
  {
    code: 257,
    name: "unknown",
    title: "UNKNOWN",
    color: "purple"
  }
];

const Response = [
  ...Header,
  {
    field: "code",
    title: "Code",
    required: true,
    size: 1,
    format: val => HexToUnsignedInt(val),
    display: valFormat => {
      let res = CommandResponse.find(({ code }) => code === valFormat);

      if (res) {
        return res.title;
      }
      return CommandResponse.find(({ name }) => name === "unknown").title;
    }
  },
  {
    field: "message",
    title: "Message",
    required: true,
    size: 50,
    format: val => HexToAscii(val),
    display: valFormat => valFormat
  }
];

const CommandHeader = [
  {
    field: "prefix",
    title: "Prefix",
    header: true,
    size: 2,
    format: () => AsciiToHex(config.command.prefix)
  },
  {
    field: "crc",
    title: "CRC",
    header: true,
    size: 4,
    format: val => ChangeEndian(CRC32(val).padStart(4 * 2, "0"))
  },
  {
    field: "size",
    title: "Size",
    header: true,
    size: 1,
    format: hex => ChangeEndian(IntToHex(hex.length / 2, 1 * 2))
  }
];

const Command = [
  ...CommandHeader,
  {
    field: "code",
    title: "Code",
    size: 1,
    format: val => ChangeEndian(IntToHex(val, 1 * 2))
  },
  {
    field: "subCode",
    title: "Sub Code",
    size: 1,
    format: val => ChangeEndian(IntToHex(val, 1 * 2))
  },
  {
    field: "value",
    title: "Value",
    size: 8,
    format: val => ChangeEndian(IntToHex(parseInt(val), 8 * 2))
  }
];

const CommandList = [
  {
    command: "GEN_INFO",
    desc: "Get VCU firmware information",
    code: 0,
    subCode: 0,
    type: null,
    range: null
  },
  {
    command: "GEN_LED",
    desc: "Set test LED value",
    code: 0,
    subCode: 1,
    type: "Bool",
    range: "{ 0, 1 }",
    exCommand: "GEN_LED=1",
    exDesc: "Turn on the test LED"
  },
  {
    command: "GEN_OVERRIDE",
    desc: "Override the vehicle state",
    code: 0,
    subCode: 2,
    type: "I8",
    range: "{ 1, 3 }",
    exCommand: "GEN_OVERRIDE=1",
    exDesc: "Override to state 1 (Standby state)"
  },
  {
    command: "GEN_FOTA_VCU",
    desc: "Upgrade VCU firmware",
    code: 0,
    subCode: 3,
    type: null,
    range: null,
    timeout: 5 * 60
  },
  {
    command: "GEN_FOTA_HMI",
    desc: "Upgrade HMI firmware",
    code: 0,
    subCode: 4,
    type: null,
    range: null,
    timeout: 10 * 60
  },
  {
    command: "REPORT_RTC",
    desc: "Set RTC value ( E start from 1=Monday )",
    code: 1,
    subCode: 0,
    type: "U64",
    range: "{ YYMMDDHHmmssE }",
    exCommand: "REPORT_RTC=9312041530101",
    exDesc: 'Set date to "Monday 4 December 1993, 15:30:10'
  },
  {
    command: "REPORT_ODOM",
    desc: "Set odometer value",
    code: 1,
    subCode: 1,
    type: "U32",
    range: "{ 0, 99999 }",
    exCommand: "REPORT_ODOM=200",
    exDesc: "Set odometer to 200km"
  },
  {
    command: "REPORT_UNITID",
    desc: "Set unit ID of VCU",
    code: 1,
    subCode: 2,
    type: "U32",
    range: "{ 0, 4294967295 }",
    exCommand: "REPORT_UNITID=354313",
    exDesc: "Set VCU unit ID to 354313"
  },
  {
    command: "AUDIO_BEEP",
    desc: "Set beep the audio module",
    code: 2,
    subCode: 0,
    type: null,
    range: null
  },
  {
    command: "AUDIO_MUTE",
    desc: "Set the audio module mute mode",
    code: 2,
    subCode: 1,
    type: "Bool",
    range: "{ 0, 1 }",
    exCommand: "AUDIO_MUTE=0",
    exDesc: "Un-mute the audio module"
  },
  {
    command: "FINGER_ADD",
    desc: "Add new fingerprint to specified ID",
    code: 3,
    subCode: 0,
    type: "U8",
    range: "{ 0, 4 }",
    exCommand: "FINGER_ADD=2",
    exDesc: "Instruct the VCU to scan new fingerprint for ID=2",
    timeout: 30
  },
  {
    command: "FINGER_DEL",
    desc: "Delete fingerprint with specified ID",
    code: 3,
    subCode: 1,
    type: "U8",
    range: "{ 0, 4 }",
    exCommand: "FINGER_DEL=1",
    exDesc: "Instruct the VCU to delete saved fingrprint with ID=1"
  },
  {
    command: "FINGER_RST",
    desc: "Delete all saved fingerprint ID",
    code: 3,
    subCode: 2,
    type: null,
    range: null
  },
  {
    command: "REMOTE_PAIRING",
    desc: "Pairing Remote",
    code: 4,
    subCode: 0,
    type: null,
    range: null
  }
];

export { CommandResponse, Response, Command, CommandList };
