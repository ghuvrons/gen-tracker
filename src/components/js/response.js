import { getValue } from "components/js/utils";
import { parseFrame } from "components/js/frame";
import { VEHICLE_STATES } from "components/js/opt/report";
import { RESPONSE_LIST, Response } from "components/js/opt/response";

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
    message,
  };
};

const parseResCode = (code) => {
  return RESPONSE_LIST.find(({ resCode }) => resCode == code);
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

export { RESPONSE_LIST, Response, parseResponse, parseResCode, parseMessage };
