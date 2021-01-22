import { CRC32 } from "components/js/helper";
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

  let prefix = header.find(({ field }) => field === "prefix");
  if (prefix.value != config.frame.prefix) {
    console.warn(`CORRUPT: Prefix not same`);
    return;
  }

  let crc = header.find(({ field }) => field === "crc");
  if (crc.output != calculateCRC32(hexData)) {
    console.warn(`CORRUPT: CRC not valid`);
    return;
  }

  let size = header.find(({ field }) => field === "size");
  if (size.value != (hexData.length - headerSize) / 2) {
    console.warn(`CORRUPT: Size not same`);
    return;
  }

  return header;
};

export { validateFrame };
