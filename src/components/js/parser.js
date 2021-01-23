import { config } from "components/js/config";
import { Field } from "components/js/helper";
import { Header, Report } from "components/js/frame";
import { Command, COMMAND_LIST } from "components/js/command";
import { Response, RESPONSE_LIST } from "components/js/response";

const parseFrame = (hexData, frame) => {
  let cursor = 0;

  return frame.reduce((carry, el) => {
    let formatted = el.format(hexData.substr(cursor, el.size * 2));
    cursor += el.size * 2;

    return carry.concat([
      {
        ...el,
        value: formatted,
        output: el.display(formatted),
      },
    ]);
  }, []);
};

const parseReport = (hexData) => {
  let header = parseFrame(hexData, Header);
  let { frameID, unitID } = Field(header, ["frameID", "unitID"]);

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

const parseResponse = ({ payload, unitID }, hexData) => {
  let message, resCode;

  if (hexData) {
    let data = parseFrame(hexData, Response);

    resCode = RESPONSE_LIST.find(({ code }) => code === Field(data, "code"));
    message = Field(data, "message");
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

const buildCommand = (cmd) => {
  if (!cmd) return;
  return Command.reduce((carry, el, idx) => {
    let { field, format } = Command[Command.length - 1 - idx];

    switch (field) {
      case "value":
        carry = format(cmd.value || 0) + carry;
        break;
      case "subCode":
      case "code":
        carry = format(cmd[field]) + carry;
        break;
      case "size":
      case "crc":
        carry = format(carry) + carry;
        break;
      case "prefix":
        carry = format() + carry;
        break;
      default:
        break;
    }

    return carry;
  }, "").toUpperCase();
};

const parseCommand = (payload) => {
  let prop = payload;
  let value = null;

  if (!payload) return;

  // check is has value
  if (payload.indexOf("=") > -1) {
    prop = payload.split("=")[0];
    value = payload.split("=")[1];
  }

  let cmd = COMMAND_LIST.find(({ command }) => command === prop);

  return {
    ...cmd,
    hexData: buildCommand(cmd),
    value,
  };
};

export { parseFrame, parseReport, parseResponse, parseCommand };
