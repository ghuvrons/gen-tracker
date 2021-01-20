import { config } from "components/js/config";
import { Header, Report } from "components/js/frame";
import { COMMAND_LIST } from "components/js/command";
import { Response, RESPONSE_LIST } from "components/js/response";

const parseFrame = (hexData, frame) => {
  let cursor = 0;

  return frame.reduce((carry, el) => {
    let formatted = el.format(hexData.substr(cursor, el.size * 2));
    cursor += el.size * 2;

    return [
      ...carry,
      {
        ...el,
        value: formatted,
        output: el.display(formatted),
      },
    ];
  }, []);
};

const parseReport = (hexData) => {
  let header = parseFrame(hexData, Header);

  let frameID = header.find(({ field }) => field === "frameID").value;
  let unitID = header.find(({ field }) => field === "unitID").value;

  let report = Report.filter((el) => {
    let { frame } = config;
    return (
      frameID == frame.id.FULL || (frameID == frame.id.SIMPLE && el.required)
    );
  });

  return {
    unitID,
    frameID,
    hexData,
    data: parseFrame(hexData, report),
  };
};

const parseCmdResponse = ({ payload, unitID }, hexData) => {
  let message, resCode;

  if (hexData) {
    let data = parseFrame(hexData, Response);
    let codeData = data.find(({ field }) => field === "code").value;

    resCode = RESPONSE_LIST.find(({ code }) => code === codeData);
    message = data.find(({ field }) => field === "message").value;
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

export { parseFrame, parseReport, parseCmdResponse };
