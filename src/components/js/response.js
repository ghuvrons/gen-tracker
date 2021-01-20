import { Header } from "components/js/frame";
import { HexToUnsignedInt, HexToAscii } from "components/js/helper";

const RESPONSE_LIST = [
  {
    code: 0,
    name: "error",
    title: "ERROR",
    color: "red",
  },
  {
    code: 1,
    name: "ok",
    title: "OK",
    color: "green",
  },
  {
    code: 2,
    name: "invalid",
    title: "INVALID",
    color: "blue",
  },
  {
    code: 256,
    name: "timeout",
    title: "TIMEOUT",
    color: "orange",
  },
  {
    code: 257,
    name: "unknown",
    title: "UNKNOWN",
    color: "purple",
  },
];

const Response = [
  ...Header,
  {
    field: "code",
    title: "Code",
    required: true,
    size: 1,
    format: (val) => HexToUnsignedInt(val),
    display: (valFormat) => {
      let res = RESPONSE_LIST.find(({ code }) => code === valFormat);

      if (res) return res.title;
      return RESPONSE_LIST.find(({ name }) => name === "unknown").title;
    },
  },
  {
    field: "message",
    title: "Message",
    required: true,
    size: 50,
    format: (val) => HexToAscii(val),
    display: (valFormat) => valFormat,
  },
];

export { Response, RESPONSE_LIST };
