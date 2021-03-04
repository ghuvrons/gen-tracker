import { getValue } from "src/js/utils";
import { parseFrame } from "src/js/frame";
import { notify } from "src/js/framework";
import { VEHICLE_STATES } from "src/js/opt/report";
import { RESPONSE_LIST, Response } from "src/js/opt/response";

const parseResponse = hex => {
  return parseFrame(hex, Response);
};

const validResponse = (command, response) => {
  if (getValue(response, "unitID") !== command.unitID) return;
  if (getValue(response, "code") != command.code) return;
  if (getValue(response, "subCode") != command.subCode) return;
  return true;
};

const mergeResponse = (command, response, hex) => {
  let res = RESPONSE_LIST.find(({ name }) => name === "timeout");
  let message = "Timeout/Cancelled";

  if (response) {
    res = RESPONSE_LIST.find(
      ({ resCode }) => resCode === getValue(response, "resCode")
    );
    message = getValue(response, "message");
  }

  return {
    ...command,
    ...response,
    hexRes: hex,
    resCode: res.resCode,
    message
  };
};

const parseResCode = code => {
  return RESPONSE_LIST.find(({ resCode }) => resCode == code);
};

const parseMessage = msg => {
  if (!msg) return;

  let labels = Object.keys(VEHICLE_STATES);
  let values = Object.values(VEHICLE_STATES);

  return msg.replace(/\{(.+?)\}/g, function(string, val) {
    let idx = values.findIndex(v => v === parseInt(val));
    return labels[idx];
  });
};

const notifyResponse = resCode => {
  let res = parseResCode(resCode);
  let ok = res.title == "OK";

  let type = ok ? "positive" : "negative";
  let msg = ok ? "Command sent." : `Command ${res.title}`;

  notify(msg, type);
};

export {
  RESPONSE_LIST,
  Response,
  parseResponse,
  validResponse,
  mergeResponse,
  parseResCode,
  parseMessage,
  notifyResponse
};
