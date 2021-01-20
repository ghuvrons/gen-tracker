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

const parseResponse = (hexData, payload) => {
  let data = parseFrame(hexData, Response);

  let resCode = RESPONSE_LIST.find(
    ({ code }) => code === data.find(({ field }) => field === "code").value
  );

  return {
    payload,
    unitID: data.find(({ field }) => field === "unitID").value,
    // data,
    // hexData,
    resCode,
    message: data.find(({ field }) => field === "message").value,
  };
};

export { parseFrame, parseReport, parseResponse };
