import { groupBy } from "lodash";
import { EVENT_LIST, parseEvent } from "components/js/event";
import { unix2time } from "components/js/utils";
import * as getters from "./getter-types";

export default {
  [getters.getTotalReports]: ({ reports }) => (theUnit) => {
    return reports.filter(({ unitID }) => unitID.val === theUnit).length;
  },
  [getters.devReports]({ reports, theUnit }) {
    let _reports = reports.filter(({ unitID }) => unitID.val === theUnit);
    return theUnit ? _reports : [];
  },
  [getters.devEvents](state, getters) {
    let events = getters.devReports.reduce(
      (carry, { eventsGroup, logDatetime }) => {
        return carry.concat(
          ...EVENT_LIST.filter(({ bit }) =>
            parseEvent(eventsGroup.val, bit)
          ).map(({ name }) => ({
            time: unix2time(logDatetime.val),
            name,
          }))
        );
      },
      []
    );

    return groupBy(events, "name");
  },

  [getters.devCommands]({ commands, theUnit }) {
    return theUnit ? commands.filter(({ unitID }) => unitID === theUnit) : [];
  },

  [getters.devFingers]({ fingers, theUnit }) {
    return theUnit ? fingers.filter(({ unitID }) => unitID === theUnit) : [];
  },
};
