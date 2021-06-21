import { CommandHeader } from "src/data/header";
import { HexToUnsignedInt, HexToAscii } from "src/js/formatter";

const Response = [
  ...CommandHeader,
  {
    field: "resCode",
    title: "Response Code",
    required: true,
    size: 1,
    format: (v) => HexToUnsignedInt(v),
    display: (vf) => {
      let res = RESPONSE_LIST.find(({ resCode }) => resCode === vf);
      if (!res)
        res = RESPONSE_LIST.find(({ resCode }) => resCode === RESCODES.UNKNOWN);
      return res.name;
    },
  },
  {
    field: "message",
    title: "Message",
    required: true,
    size: 200,
    format: (v) => HexToAscii(v),
    display: (vf) => vf,
  },
];

const RESCODES = {
  ERROR: 0,
  OK: 1,
  INVALID: 2,
  CANCELLED: 255,
  TIMEOUT: 256,
  UNKNOWN: 257,
};

const RESPONSE_LIST = [
  {
    resCode: 0,
    name: "Error",
    icon: "error",
    color: "red",
  },
  {
    resCode: 1,
    name: "Ok",
    icon: "check",
    color: "green",
  },
  {
    resCode: 2,
    name: "Invalid",
    icon: "remove_circle",
    color: "blue",
  },
  {
    resCode: 255,
    name: "Cancelled",
    icon: "cancel",
    color: "yellow",
  },
  {
    resCode: 256,
    name: "Timeout",
    icon: "timer_off",
    color: "orange",
  },
  {
    resCode: 257,
    name: "Unknown",
    icon: "help",
    color: "purple",
  },
];

export { RESCODES, RESPONSE_LIST, Response };
