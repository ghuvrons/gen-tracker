import { getField } from "components/js/utils";
import { RESPONSE_LIST, Response } from "components/js/opt/response";

const parseResponse = ({ payload, unitID }, hexData) => {
  let message, resCode;

  if (hexData) {
    let data = parseFrame(hexData, Response);

    resCode = RESPONSE_LIST.find(({ code }) => code === getField(data, "code"));
    message = getField(data, "message");
  } else {
    resCode = RESPONSE_LIST.find(({ name }) => name === "timeout");
    message = null;
  }

  return {
    payload,
    unitID,
    resCode,
    message,
  };
};

export { RESPONSE_LIST, Response, parseResponse };
