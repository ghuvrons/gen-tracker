import config from "components/js/opt/config";
// import { CRC32 } from "components/js/crc32-mpeg2";
import {
  ChangeEndian,
  Dot,
  HexToAscii,
  AsciiToHex,
  HexToUnsignedInt,
  IntToHex
} from "components/js/helper";

const Header = [
  {
    group: "packet",
    field: "prefix",
    title: "Prefix",
    header: true,
    required: true,
    size: 2,
    format: val => HexToAscii(ChangeEndian(val)),
    display: valFormat => valFormat,
    formatCmd: _ => ChangeEndian(AsciiToHex(config.prefix.command))
  },
  // {
  //   group: "packet",
  //   field: "crc",
  //   title: "CRC",
  //   header: true,
  //   required: true,
  //   chartable: true,
  //   size: 4,
  //   format: val => HexToUnsignedInt(ChangeEndian(val)),
  //   display: valFormat => IntToHex(valFormat, 8).toUpperCase(),
  //   formatCmd: val => ChangeEndian(CRC32(val).padStart(4 * 2, "0"))
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
    format: val => HexToUnsignedInt(ChangeEndian(val)),
    display: valFormat => Dot(valFormat),
    formatCmd: hex => ChangeEndian(IntToHex(hex.length / 2, 1 * 2))
  },
  {
    group: "packet",
    field: "unitID",
    title: "Unit ID",
    header: true,
    required: true,
    size: 4,
    format: val => HexToUnsignedInt(ChangeEndian(val)),
    display: valFormat => valFormat,
    formatCmd: val => ChangeEndian(IntToHex(val, 4 * 2))
  }
];

export { Header };
