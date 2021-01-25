import { config } from "components/js/opt/config";
import { CRC32 } from "components/js/crc32-mpeg2";
import {
  ChangeEndian,
  Dot,
  HexToAscii,
  AsciiToHex,
  HexToUnsignedInt,
  IntToHex,
} from "components/js/helper";

const Header = [
  {
    field: "prefix",
    title: "Prefix",
    header: true,
    required: true,
    size: 2,
    format: (val) => HexToAscii(ChangeEndian(val)),
    display: (valFormat) => valFormat,
  },
  {
    field: "crc",
    title: "CRC",
    header: true,
    required: true,
    chartable: true,
    size: 4,
    format: (val) => HexToUnsignedInt(ChangeEndian(val)),
    display: (valFormat) => IntToHex(valFormat, 8).toUpperCase(),
  },
  {
    field: "size",
    title: "Size",
    header: true,
    required: true,
    chartable: true,
    unit: "Bytes",
    size: 1,
    format: (val) => HexToUnsignedInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat),
  },
  {
    field: "frameID",
    title: "Frame ID",
    header: true,
    required: true,
    chartable: true,
    unit: "Type",
    size: 1,
    format: (val) => HexToUnsignedInt(ChangeEndian(val)),
    display: (valFormat) => {
      let frameIDs = ["Response", "Simple", "Full"];

      return `${valFormat} (${frameIDs[valFormat]})`;
    },
  },
  {
    field: "unitID",
    title: "Unit ID",
    header: true,
    required: true,
    size: 4,
    format: (val) => HexToUnsignedInt(ChangeEndian(val)),
    display: (valFormat) => valFormat,
  },
  {
    field: "sequentialID",
    title: "Sequential ID",
    required: true,
    chartable: true,
    size: 2,
    format: (val) => HexToUnsignedInt(ChangeEndian(val)),
    display: (valFormat) => Dot(valFormat),
  },
];

const CommandHeader = [
  {
    field: "prefix",
    title: "Prefix",
    header: true,
    size: 2,
    format: () => AsciiToHex(config.command.prefix),
  },
  {
    field: "crc",
    title: "CRC",
    header: true,
    size: 4,
    format: (val) => ChangeEndian(CRC32(val).padStart(4 * 2, "0")),
  },
  {
    field: "size",
    title: "Size",
    header: true,
    size: 1,
    format: (hex) => ChangeEndian(IntToHex(hex.length / 2, 1 * 2)),
  },
];

export { Header, CommandHeader };
