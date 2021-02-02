import { COMMAND_LIST, Command } from "components/js/opt/command";
import { isString } from "components/js/utils";
import moment from "moment";

const buildCommand = (cmd, value) => {
  if (!cmd) return;

  return Command.reduce((carry, el, idx) => {
    let { field, format } = Command[Command.length - 1 - idx];

    switch (field) {
      case "value":
        if (cmd.hasOwnProperty("format")) carry = cmd.format(value) + carry;
        else carry = format(value || 0) + carry;
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
  if (cmd.range) {
    if (!value) return "Command need value";

    const [min, max] = cmd.range;
    if (!isString(min)) {
      if (value < min || value > max) return "Value not in range";
    } else if (cmd.command == "REPORT_RTC") {
      if (!moment(value, "YYMMDDHHmmssEE").isValid()) return "Datetime invalid";
    } else if (value.length != min.length) return "Value length is invalid";
  } else if (value) return "Command dont need value";

  return {
    ...cmd,
    hex: buildCommand(cmd, value),
    value,
  };
};

export { COMMAND_LIST, Command, parseCommand, extractCommand };
