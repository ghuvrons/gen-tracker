import { COMMAND_LIST, Command } from "src/js/opt/command";

const buildCommand = (cmd, unitID) => {
  if (!cmd) return;

  return Command.reduce((acc, el, idx) => {
    let { field, formatCmd } = Command[Command.length - idx - 1];

    switch (field) {
      case "value":
        if (cmd.hasOwnProperty("formatCmd"))
          acc = cmd.formatCmd(cmd.value) + acc;
        else acc = formatCmd(cmd.value || 0) + acc;
        break;
      case "subCode":
      case "code":
        acc = formatCmd(cmd[field]) + acc;
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

const parseCommand = (payload, log) => {
  // check is no payload
  if (!payload) return log("Empty payload.");

  let { prop, value } = extractCommand(payload);

  // check is command exist
  let cmd = COMMAND_LIST.find(({ command }) => command === prop);
  if (!cmd) return log("Unknown command.");

  // check is value in range
  if (!cmd.range) {
    if (value) return log("Command dont need value");
  } else {
    if (!value) return log("Command need value");

    if (cmd.validator) {
      if (!cmd.validator(value)) return log("Value is invalid");
    } else {
      const [min, max] = cmd.range;
      if (value < min || value > max) return log("Value not in range");
    }
  }

  return {
    ...cmd,
    value
  };
};

export { COMMAND_LIST, Command, parseCommand, buildCommand, extractCommand };
