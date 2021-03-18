const IntToHex = (num, len) => {
  return num.toString(16).padStart(len, "0");
};

const HexToUnsignedInt = (hex) => {
  return parseInt(hex, 16);
};

const HexToSignedInt32 = (hex) => {
  if (hex.length % 2 !== 0) hex = "0" + hex;
  const maxVal = Math.pow(2, (hex.length / 2) * 8);
  let num = parseInt(hex, 16);
  if (num > maxVal / 2 - 1) num = num - maxVal;
  return num;
};

const HexToSignedInt8 = (hex) => {
  let num = parseInt(hex, 16);
  if (num > 127) num -= 256;
  return num;
};

const HexToAscii = (hex) => {
  let str = "";
  hex = hex.toString(); // force conversion
  for (let i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

const AsciiToHex = (str) => {
  let arr = [];
  for (let n = 0, l = str.length; n < l; n++)
    arr.push(Number(str.charCodeAt(n)).toString(16));
  return arr.join("");
};

const Dot = (val, digit = 0) => {
  return Number(val).toLocaleString("id", {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  });
};

const cend = (string) => {
  // Change Endian
  const result = [];
  let len = string.length - 2;
  while (len >= 0) {
    result.push(string.substr(len, 2));
    len -= 2;
  }
  return result.join("");
};

export {
  IntToHex,
  HexToUnsignedInt,
  HexToSignedInt8,
  HexToSignedInt32,
  HexToAscii,
  AsciiToHex,
  cend,
  Dot,
};
