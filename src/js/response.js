import { getValue } from "src/js/utils";
import { parseFrame } from "src/js/frame";
import { notify } from "src/js/framework";
import { VEHICLE_STATES } from "src/js/opt/report";
import { RESPONSE_LIST, Response } from "src/js/opt/response";

const parseResponse = ({ payload, unitID, code, subCode, hexCmd }, hexRes) => {
  let res = RESPONSE_LIST.find(({ name }) => name === "timeout");
  let message = null;

  if (hexRes) {
    let data = parseFrame(hexRes, Response);

    if (getValue(data, "code") != code) return;

    if (getValue(data, "subCode") != subCode) return;

    res = RESPONSE_LIST.find(
      ({ resCode }) => resCode === getValue(data, "resCode")
    );
    message = getValue(data, "message");
  }

  return {
    hexCmd,
    hexRes,
    unitID,
    payload,
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

const notifyResponse = ({ resCode }) => {
  let res = parseResCode(resCode);
  let ok = res.title == "OK";

  let type = ok ? "positive" : "negative";
  let msg = ok ? "Command sent." : `Command is ${res.title}`;

  notify(msg, type);
};

export {
  RESPONSE_LIST,
  Response,
  parseResponse,
  parseResCode,
  parseMessage,
  notifyResponse
};
