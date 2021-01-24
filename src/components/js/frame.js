import { CRC32 } from "components/js/crc32-mpeg2";
import { getField } from "components/js/utils";
import { Header } from "components/js/opt/header";
import { config } from "components/js/opt/config";

const calculateCRC32 = (hexData) => {
  let crcSize = Header.filter(({ field }) => ["prefix", "crc"].includes(field))
    .map(({ size }) => size)
    .reduce((sum, val) => sum + val);

  return CRC32(hexData.substring(crcSize * 2));
};

const parseFrame = (hexData, frame) => {
  let cursor = 0;

  return frame.reduce((carry, el) => {
    let formatted = el.format(hexData.substr(cursor, el.size * 2));
    cursor += el.size * 2;

    return carry.concat([
      {
        ...el,
        value: formatted,
        output: el.display(formatted),
      },
    ]);
  }, []);
};

const validateFrame = (hexData) => {
  let header = parseFrame(hexData, Header);

  let headerSize = Header.map(({ size }) => size).reduce(
    (sum, val) => sum + val
  );
  if (hexData.length < headerSize * 2) {
    console.warn(`CORRUPT: Bellow minimum size`);
    return;
  }

  if (getField(header, "prefix") != config.frame.prefix) {
    console.warn(`CORRUPT: Prefix not same`);
    return;
  }

  let crc = header.find(({ field }) => field === "crc").output;
  if (crc != calculateCRC32(hexData)) {
    console.warn(`CORRUPT: CRC not valid`);
    return;
  }

  if (getField(header, "size") != (hexData.length - headerSize) / 2) {
    console.warn(`CORRUPT: Size not same`);
    return;
  }

  return header;
};

export { Header, parseFrame, validateFrame };
