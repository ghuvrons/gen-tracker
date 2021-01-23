import { CRC32, Field } from "components/js/helper";
import { Header } from "components/js/frame";
import { parseFrame } from "components/js/parser";
import { config } from "components/js/config";

const calculateCRC32 = (hexData) => {
  let crcSize = Header.filter(({ field }) => ["prefix", "crc"].includes(field))
    .map(({ size }) => size)
    .reduce((sum, val) => sum + val);

  return CRC32(hexData.substring(crcSize * 2));
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

  if (Field(header, "prefix") != config.frame.prefix) {
    console.warn(`CORRUPT: Prefix not same`);
    return;
  }

  let crc = header.find(({ field }) => field === "crc").output;
  if (crc != calculateCRC32(hexData)) {
    console.warn(`CORRUPT: CRC not valid`);
    return;
  }

  if (Field(header, "size") != (hexData.length - headerSize) / 2) {
    console.warn(`CORRUPT: Size not same`);
    return;
  }

  return header;
};

export { validateFrame };
