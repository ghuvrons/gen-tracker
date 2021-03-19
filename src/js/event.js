import { groupBy } from "lodash";
import { FIELD_EVENTS } from "src/js/opt/event";
import dayjs from "src/js/dayjs";
const Long = require("long");

const parseEvent = (value, bit) => {
  return Long.fromNumber(value, 1).shiftRight(bit) & 1;
};

const readEvent = (LIST, eventsGroup) => {
  return LIST.filter((evt, bit) => parseEvent(eventsGroup.val, bit));
};

const groupEvent = (field, report) => {
  const events = report
    .filter((r) => r[field])
    .reduce(
      (acc, { [field]: event, logDatetime }) =>
        acc.concat(
          ...FIELD_EVENTS[field]
            .filter((evt, bit) => parseEvent(event.val, bit))
            .map((evt) => ({
              time: dayjs.unix(logDatetime.val).format("HH:mm:ss"),
              name: evt,
            }))
        ),
      []
    );

  return events.length == 0 ? events : groupBy(events, "name");
};

export { parseEvent, readEvent, groupEvent };
