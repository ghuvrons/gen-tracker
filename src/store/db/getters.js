import { groupBy } from "lodash";
import { getValue } from "components/js/utils";
import { EVENT_LIST, parseEvent } from "components/js/event";
import * as getters from "./getter-types";

export default {
  [getters.getTotalReports]: ({ reports }) => (unitID) => {
    return reports.filter(({ unitID: _unitID }) => _unitID === unitID).length;
  },
  [getters.devReports]({ reports, theUnit }) {
    // let _reports = reports.filter(({ unitID }) => unitID === theUnit);
    // return theUnit ? _reports : [];
    return [];
  },
  [getters.devEvents](state, getters) {
    let events = getters.devReports.reduce((carry, { data }) => {
      return carry.concat(
        ...EVENT_LIST.filter(({ bit }) =>
          parseEvent(getValue(data, "eventsGroup"), bit)
        ).map(({ name }) => ({
          logDatetime: getValue(data, "logDatetime"),
          name,
        }))
      );
    }, []);

    return groupBy(events, "name");
  },

  [getters.devCommands]({ commands, theUnit }) {
    return theUnit ? commands.filter(({ unitID }) => unitID === theUnit) : [];
  },

  [getters.devFingers]({ fingers, theUnit }) {
    return theUnit ? fingers.filter(({ unitID }) => unitID === theUnit) : [];
  },
};
