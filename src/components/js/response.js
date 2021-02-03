import { getValue } from "components/js/utils";
import { parseFrame } from "components/js/frame";
import { RESPONSE_LIST, Response } from "components/js/opt/response";

const parseResponse = ({ payload, unitID, code, subCode }, hex) => {
  let message, res;

  if (hex) {
    let data = parseFrame(hex, Response);

    if (getValue(data, "unitID") != unitID) return;

    res = RESPONSE_LIST.find(
      ({ resCode }) => resCode === getValue(data, "resCode")
    );

    if (!res) return;

    if (getValue(data, "code") != code) return;

    if (getValue(data, "subCode") != subCode) return;

    message = getValue(data, "message");
  } else {
    res = RESPONSE_LIST.find(({ name }) => name === "timeout");
    message = null;
  }

  return {
    payload,
    unitID,
    resCode: res.resCode,
    message,
  };
};

const parseResCode = (code) => {
  return RESPONSE_LIST.find(({ resCode }) => resCode == code);
};

export { RESPONSE_LIST, Response, parseResponse, parseResCode };
