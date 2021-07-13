import { getValue } from "src/js/utils";
import { parseFrame } from "src/js/frame";
import { notify } from "src/js/framework";
import { VEHICLE_STATES } from "src/data/report";
import { RESCODES, RESPONSE_LIST, Response } from "src/data/response";

const parseResponse = (hex) => {
  return parseFrame(hex, Response);
};

const validResponse = (command, response) => {
  if (!command) return;
  if (getValue(response, "vin") != command.vin) return;
  if (getValue(response, "code") != command.code) return;
  if (getValue(response, "subCode") != command.subCode) return;
  return true;
};

const parseResCode = (code) => {
  return RESPONSE_LIST.find(({ resCode }) => resCode === code);
};

const readResCode = (code) => {
  return parseResCode(code) ?? parseResCode(RESCODES.UNKNOWN);
};

const makeResponse = (response) => {
  let res, message;

  if (typeof response === "object") {
    res = readResCode(getValue(response, "resCode"));
    message = getValue(response, "message");
  } else res = readResCode(response);

  if (!res) res = readResCode(RESCODES.UNKNOWN);

  return {
    resCode: res.resCode,
    message,
  };
};

const parseMessage = (msg) => {
  if (!msg) return;

  const labels = Object.keys(VEHICLE_STATES);
  const values = Object.values(VEHICLE_STATES);

  return msg.replace(/\{(.+?)\}/g, function (string, val) {
    const idx = values.findIndex((v) => v === parseInt(val));
    return labels[idx];
  });
};

const notifyResponse = ({ resCode }) => {
  const ok = resCode == RESCODES.OK;
  const res = parseResCode(resCode);

  const type = ok ? "positive" : "negative";
  const msg = ok ? "Command sent." : `Command ${res.name}`;

  notify(msg, type);
};

export {
  RESCODES,
  RESPONSE_LIST,
  Response,
  parseResponse,
  validResponse,
  makeResponse,
  parseResCode,
  parseMessage,
  notifyResponse,
};
