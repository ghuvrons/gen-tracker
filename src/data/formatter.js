import { cend, IntToHex } from "src/js/formatter";

export const TimeStamp = (YYMMDDHHmmss0d) => {
  const datetime = YYMMDDHHmmss0d.match(/.{1,2}/g);

  return datetime
    .reduce((acc, dt) => acc.concat(IntToHex(parseInt(dt), 2)), "")
    .toUpperCase();
};

export const MCU = {
  // TODO: replace with binary payload
  TEMPLATES: (v) => {
    let hex = "";
    const templates = v.split(";");

    for (let i = 0; i < templates.length; i++) {
      const params = templates[i].split(",");

      for (let j = 0; j < params.length; j++) {
        hex += cend(IntToHex(parseInt(params[j]), 4));
      }
    }
    return hex;
  },
};

export default { TimeStamp, MCU };
