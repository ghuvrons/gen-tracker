import { COMMAND_LIST, Command } from "components/js/opt/command";

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

export { COMMAND_LIST, Command, parseCommand };
