// import { CRC32 } from "src/js/crc32-mpeg2";
import { getValue, getOutput } from "src/js/utils";
import { Header } from "src/js/opt/header";
import config from "src/js/opt/config";

// const calculateCRC32 = (hex) => {
//   let crcSize = Header.filter(({ field }) => ["prefix", "crc"].includes(field))
//     .map(({ size }) => size)
//     .reduce((sum, val) => sum + val);
//   return CRC32(hex.substring(crcSize * 2));
// };

const parseFrame = (hex, frame) => {
  let cursor = 0;

  return frame.reduce((acc, el) => {
    let formatted = el.format(hex.substr(cursor, el.size * 2));
    cursor += el.size * 2;

    return acc.concat([
      {
        ...el,
        value: formatted,
        output: el.display(formatted)
      }
    ]);
  }, []);
};

const validateFrame = hex => {
  let header = parseFrame(hex, Header);
  let { report, response } = config.prefix;

  let prefix = getValue(header, "prefix");
  if (![report, response].includes(prefix))
    return console.warn(`CORRUPT: Prefix not same`);

  // let crc = getOutput(header, "crc");
  // if (crc != calculateCRC32(hex)) return console.warn(`CORRUPT: CRC not valid`);

  let headerSize = Header.filter(({ field }) =>
    [
      "prefix",
      // "crc",
      "size"
    ].includes(field)
  )
    .map(({ size }) => size)
    .reduce((sum, val) => sum + val);

  if (getValue(header, "size") != hex.length / 2 - headerSize)
    return console.warn(`CORRUPT: Size not same`);

  return header;
};

export { Header, parseFrame, validateFrame };
