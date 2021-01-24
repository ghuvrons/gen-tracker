import { EVENT_LIST } from "components/js/opt/event";
const Long = require("long");

const parseEvent = (value, bit) => {
  return Long.fromNumber(value, 1).shiftRight(bit) & 1;
};

export { EVENT_LIST, parseEvent };
