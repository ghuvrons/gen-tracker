import { config } from "./config";
import { AsciiToHex, IntToHex, ChangeEndian } from "./helper";

const ACK = [
  {
    field: "prefix",
    title: "Prefix",
    header: true,
    size: 2,
    format: () => AsciiToHex(config.ack.prefix)
  },
  {
    field: "frameID",
    title: "Frame ID",
    header: true,
    required: true,
    chartable: true,
    size: 1,
    format: val => ChangeEndian(IntToHex(val, 1 * 2))
  },
  {
    field: "sequentialID",
    title: "Sequential ID",
    required: true,
    chartable: true,
    size: 2,
    format: val => ChangeEndian(IntToHex(val, 2 * 2))
  }
];

export { ACK };
