// import { CRC32 } from "src/js/crc32-mpeg2";
import { getValue, getOutput } from "src/js/utils";
import { CommandHeader, Header } from "src/js/opt/header";
import config from "src/js/opt/config";

// const calculateCRC32 = (hex) => {
//   const crcSize = Header.filter(({ field }) => ["prefix", "crc"].includes(field))
//     .map(({ size }) => size)
//     .reduce((sum, val) => sum + val);
//   return CRC32(hex.substring(crcSize * 2));
// };

const parseFrame = (hex, frame) => {
  let cursor = 0;

  return frame.reduce((acc, el) => {
    const formatted = el.format(hex.substr(cursor, el.size * 2));
    cursor += el.size * 2;

    return acc.concat([
      {
        ...el,
        value: formatted,
        output: el.display(formatted),
      },
    ]);
  }, []);
};

const validateFrame = (hex, prefix) => {
  const theHeader = prefix == config.prefix.report ? Header : CommandHeader;
  const header = parseFrame(hex, theHeader);

  if (getValue(header, "prefix") != prefix)
    return console.warn(`CORRUPT: Prefix not same`);

  // const crc = getOutput(header, "crc");
  // if (crc != calculateCRC32(hex)) return console.warn(`CORRUPT: CRC not valid`);

  const headerSize = theHeader
    .filter(({ field }) =>
      [
        "prefix",
        // "crc",
        "size",
      ].includes(field)
    )
    .map(({ size }) => size)
    .reduce((sum, val) => sum + val);

  if (getValue(header, "size") != hex.length / 2 - headerSize)
    return console.warn(`CORRUPT: Size not same`);

  return header;
};

export { parseFrame, validateFrame };
