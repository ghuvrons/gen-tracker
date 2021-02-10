import { COMMAND_LIST, Command } from "components/js/opt/command";
import { isString } from "components/js/utils";

const buildCommand = (cmd, unitID) => {
  if (!cmd) return;

  return Command.reduce((carry, el, idx) => {
    let { field, formatCmd } = Command[Command.length - idx - 1];

    switch (field) {
      case "value":
        if (cmd.hasOwnProperty("formatCmd"))
          carry = cmd.formatCmd(cmd.value) + carry;
        else carry = formatCmd(cmd.value || 0) + carry;
        break;
      case "subCode":
      case "code":
        carry = formatCmd(cmd[field]) + carry;
        break;
      case "unitID":
        carry = formatCmd(unitID) + carry;
        break;
      case "size":
      case "crc":
      case "prefix":
        carry = formatCmd(carry) + carry;
        break;
      default:
        break;
    }

    return carry;
  }, "").toUpperCase();
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

const parseCommand = (payload) => {
  let { prop, value } = extractCommand(payload);

  // check is no payload
  if (!payload) return "Empty payload.";

  // check is command exist
  let cmd = COMMAND_LIST.find(({ command }) => command === prop);
  if (!cmd) return "Unknown command.";

  // check is value in range
  if (!cmd.range) {
    if (value) return "Command dont need value";
  } else {
    if (!value) return "Command need value";

    if (cmd.validator && !cmd.validator(value)) return "Value is invalid";
    else {
      const [min, max] = cmd.range;
      if (value < min || value > max) return "Value not in range";
    }
  }

  return {
    ...cmd,
    value,
  };
};

export { COMMAND_LIST, Command, parseCommand, buildCommand, extractCommand };
