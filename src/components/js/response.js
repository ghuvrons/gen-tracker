import { getField } from "components/js/utils";
import { parseFrame } from "components/js/frame";
import { RESPONSE_LIST, Response } from "components/js/opt/response";

const parseResponse = ({ payload, unitID, code, subCode }, hexData) => {
  let message, res;

  if (hexData) {
    let data = parseFrame(hexData, Response);

    res = RESPONSE_LIST.find(
      ({ resCode }) => resCode === getField(data, "resCode")
    );

    if (!res) return;

    if (getField(data, "code") != code) return;

    if (getField(data, "subCode") != subCode) return;

    message = getField(data, "message");
  } else {
    res = RESPONSE_LIST.find(({ name }) => name === "timeout");
    message = null;
  }

  return {
    payload,
    unitID,
    res,
    message,
  };
};

export { RESPONSE_LIST, Response, parseResponse };
