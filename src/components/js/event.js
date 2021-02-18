import { EVENT_LIST } from "components/js/opt/event";
import { groupBy } from "lodash";
import moment from "moment";
const Long = require("long");

const parseEvent = (value, bit) => {
  return Long.fromNumber(value, 1).shiftRight(bit) & 1;
};

const readEvent = ({ eventsGroup }) => {
  return EVENT_LIST.filter(({ bit }) => parseEvent(eventsGroup.val, bit)).map(
    ({ name }) => name
  );
};

const eventHistories = report => {
  return groupBy(
    report.reduce(
      (acc, { eventsGroup, logDatetime }) =>
        acc.concat(
          ...EVENT_LIST.filter(({ bit }) =>
            parseEvent(eventsGroup.val, bit)
          ).map(({ name }) => ({
            time: moment.unix(logDatetime.val).format("HH:mm:ss"),
            name
          }))
        ),
      []
    ),
    "name"
  );
};

export { EVENT_LIST, parseEvent, readEvent, eventHistories };
