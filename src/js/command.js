import dayjs from "src/js/dayjs";
import { COMMAND_LIST, Command } from "src/js/opt/command";
import config from "./opt/config";

const awaitCommand = cmd => cmd && !cmd.hasOwnProperty("resCode");

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
    hexCmd
  };
};

const extractCommand = payload => {
  let prop = payload;
  let value = null;

  // get value from payload
  if (payload.indexOf("=") > -1) {
    prop = payload.split("=")[0];
    value = payload.split("=")[1];
  }

  return { prop, value };
};

const parseCommand = payload => {
  let { prop, value } = extractCommand(payload);

  // check is command exist
  let cmd = COMMAND_LIST.find(({ command }) => command === prop);
  if (!cmd) return "Unknown command.";

  // check is value in range
  if (!cmd.size) {
    if (value) return "Command dont need value";
  } else {
    if (!value) return "Command need value";

    if (cmd.validator) {
      if (!cmd.validator(value)) return "Value is invalid";
    } else {
      const [min, max] = cmd.range;
      if (value < min || value > max) return "Value not in range";
    }
  }

  return {
    ...cmd,
    timeout: cmd.timeout || config.command.timeout,
    payload,
    value
  };
};

export {
  COMMAND_LIST,
  Command,
  awaitCommand,
  parseCommand,
  buildCommand,
  extractCommand
};
