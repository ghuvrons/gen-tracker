import { Header } from "src/js/opt/header";
import { HexToUnsignedInt, HexToAscii } from "src/js/formatter";

const RESPONSE_LIST = [
  {
    resCode: 0,
    name: "error",
    title: "ERROR",
    color: "red"
  },
  {
    resCode: 1,
    name: "ok",
    title: "OK",
    color: "green"
  },
  {
    resCode: 2,
    name: "invalid",
    title: "INVALID",
    color: "blue"
  },
  {
    resCode: 256,
    name: "timeout",
    title: "TIMEOUT",
    color: "orange"
  },
  {
    resCode: 257,
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
    display: valFormat => valFormat
  },
  {
    field: "subCode",
    title: "Sub Code",
    required: true,
    size: 1,
    format: val => HexToUnsignedInt(val),
    display: valFormat => valFormat
  },
  {
    field: "resCode",
    title: "Response Code",
    required: true,
    size: 1,
    format: val => HexToUnsignedInt(val),
    display: valFormat => {
      let res = RESPONSE_LIST.find(({ resCode }) => resCode === valFormat);

      if (res) return res.title;
      return RESPONSE_LIST.find(({ name }) => name === "unknown").title;
    }
  },
  {
    field: "message",
    title: "Message",
    required: true,
    size: 200,
    format: val => HexToAscii(val),
    display: valFormat => valFormat
  }
];

export { RESPONSE_LIST, Response };
