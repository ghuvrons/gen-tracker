import { getValue } from "src/js/utils";
import { parseFrame } from "src/js/frame";
import { notify } from "src/js/framework";
import { VEHICLE_STATES } from "src/js/opt/report";
import { RESCODES, RESPONSE_LIST, Response } from "src/js/opt/response";

const parseResponse = (hex) => {
  return parseFrame(hex, Response);
};

const validResponse = (command, response) => {
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

  let labels = Object.keys(VEHICLE_STATES);
  let values = Object.values(VEHICLE_STATES);

  return msg.replace(/\{(.+?)\}/g, function (string, val) {
    let idx = values.findIndex((v) => v === parseInt(val));
    return labels[idx];
  });
};

const notifyResponse = ({ resCode }) => {
  let ok = resCode == RESCODES.OK;
  let res = parseResCode(resCode);

  let type = ok ? "positive" : "negative";
  let msg = ok ? "Command sent." : `Command ${res.name}`;

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
