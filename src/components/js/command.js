import { COMMAND_LIST, Command } from "components/js/opt/command";
import { isStr } from "components/js/utils";
import moment from "moment";

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

  // get value from payload
  if (payload.indexOf("=") > -1) {
    prop = payload.split("=")[0];
    value = payload.split("=")[1];
  }

  // check is no payload
  if (!payload) return "Empty payload.";

  // check is command exist
  let cmd = COMMAND_LIST.find(({ command }) => command === prop);
  if (!cmd) return "Unknown command.";

  // check is value in range
  if (cmd.range) {
    if (!value) return "Command need value";

    const [min, max] = cmd.range;
    if (!isStr(min)) {
      if (value < min || value > max) return "Value exceeds range";
    } else if (cmd.command.indexOf("RTC") > -1) {
      if (!moment(value, "YYMMDDHHmmssE").isValid()) return "Datetime invalid";
    } else if (value.length != min.length) return "Value length is invalid";
  } else if (value) return "Command dont need value";

  return {
    ...cmd,
    hexData: buildCommand(cmd),
    value,
  };
};

export { COMMAND_LIST, Command, parseCommand };
