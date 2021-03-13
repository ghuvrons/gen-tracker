import { get } from "lodash";
import dayjs from "src/js/dayjs";
import { COMMAND_LIST, Command } from "src/js/opt/command";
import { parseFrame } from "./frame";
import config from "./opt/config";

const parseCommand = (hex) => {
  return parseFrame(hex, Command);
};

const buildCommand = (cmd, unitID) => {
  const sendDatetime = dayjs().unix();
  const hexCmd = Command.reduce((acc, el, idx) => {
    let { field, formatCmd } = Command[Command.length - idx - 1];

    switch (field) {
      case "value":
        if (cmd.hasOwnProperty("formatCmd"))
          acc = cmd.formatCmd(cmd.value) + acc;
        else acc = formatCmd(cmd.value, cmd.size) + acc;
        break;
      case "subCode":
      case "code":
        acc = formatCmd(cmd[field]) + acc;
        break;
      case "sendDatetime":
        acc = formatCmd(sendDatetime) + acc;
        break;
      case "unitID":
        acc = formatCmd(unitID) + acc;
        break;
      case "size":
      // case "crc":
      case "prefix":
        acc = formatCmd(acc) + acc;
        break;
      default:
        break;
    }
    return acc;
  }, "").toUpperCase();

  return {
    ...cmd,
    unitID,
    sendDatetime,
    hexCmd,
  };
};

const extractCommand = (payload) => {
  let prop = payload;
  let value = null;

  // get value from payload
  if (payload.indexOf("=") > -1) {
    prop = payload.split("=")[0];
    value = payload.split("=")[1];
  }

  return { prop, value };
};

const makeCommand = (payload) => {
  const { prop, value } = extractCommand(payload);
  const cmd = COMMAND_LIST.find(({ command }) => command === prop);

  return {
    ...cmd,
    timeout: cmd?.timeout ?? 10,
    payload,
    value,
  };
};

const validateCommand = (payload) => {
  const cmd = makeCommand(payload);

  if (!cmd) return "Unknown command.";

  // check is value in range
  if (!cmd.size) {
    if (cmd.value) return "Command dont need value";
  } else {
    if (!cmd.value) return "Command need value";

    if (cmd.validator) {
      if (!cmd.validator(cmd.value)) return "Value is invalid";
    } else {
      const [min, max] = cmd.range;
      if (cmd.value < min || cmd.value > max) return "Value not in range";
    }
  }

  return cmd;
};

export {
  COMMAND_LIST,
  Command,
  parseCommand,
  validateCommand,
  buildCommand,
  extractCommand,
};
