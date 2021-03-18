import config from "src/js/opt/config";
import dayjs from "src/js/dayjs";
// import { CRC32 } from "src/js/crc32-mpeg2";
import {
  cend,
  Dot,
  HexToAscii,
  AsciiToHex,
  HexToUnsignedInt,
  IntToHex,
} from "src/js/formatter";
import { buildTimestamp, parseDatetime } from "src/js/utils";

const Header = [
  {
    group: "packet",
    field: "prefix",
    title: "Prefix",
    header: true,
    required: true,
    size: 2,
    format: (v) => HexToAscii(cend(v)),
    display: (vf) => vf,
    formatCmd: (_) => cend(AsciiToHex(config.prefix.command)),
  },
  // {
  //   group: "packet",
  //   field: "crc",
  //   title: "CRC",
  //   header: true,
  //   required: true,
  //   chartable: true,
  //   size: 4,
  //   format: v => HexToUnsignedInt(cend(v)),
  //   display: vf => IntToHex(vf, 8).toUpperCase(),
  //   formatCmd: v => cend(CRC32(v).padStart(4 * 2, "0"))
  // },
  {
    group: "packet",
    field: "size",
    title: "Size",
    header: true,
    required: true,
    chartable: true,
    unit: "Bytes",
    size: 1,
    format: (v) => HexToUnsignedInt(cend(v)),
    display: (vf) => Dot(vf),
    formatCmd: (hex) => cend(IntToHex(hex.length / 2, 1 * 2)),
  },
  {
    group: "packet",
    field: "vin",
    title: "VIN",
    header: true,
    required: true,
    size: 4,
    format: (v) => HexToUnsignedInt(cend(v)),
    display: (vf) => vf,
    formatCmd: (v) => cend(IntToHex(v, 4 * 2)),
  },
  {
    group: "packet.datetime",
    field: "sendDatetime",
    title: "Send Datetime",
    header: true,
    required: true,
    chartable: true,
    size: 7,
    format: (v) => Number(dayjs(parseDatetime(v), "YYMMDDHHmmss0d").unix()),
    display: (vf) => dayjs.unix(vf).format("ddd, DD-MM-YY HH:mm:ss"),
    formatCmd: (unix) =>
      buildTimestamp(dayjs.unix(unix).format("YYMMDDHHmmss0d")),
  },
];

const CommandHeader = [
  ...Header,
  {
    group: "command",
    field: "code",
    title: "Code",
    header: true,
    required: true,
    size: 1,
    format: (v) => HexToUnsignedInt(v),
    display: (vf) => vf,
    formatCmd: (v) => cend(IntToHex(v, 1 * 2)),
  },
  {
    group: "command",
    field: "subCode",
    title: "Sub Code",
    header: true,
    required: true,
    size: 1,
    format: (v) => HexToUnsignedInt(v),
    display: (vf) => vf,
    formatCmd: (v) => cend(IntToHex(v, 1 * 2)),
  },
];

export { Header, CommandHeader };
