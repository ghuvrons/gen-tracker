import { groupBy } from "lodash";
import { getField } from "components/js/utils";
import { EVENT_LIST, parseEvent } from "components/js/event";
import * as getters from "./getter-types";

export default {
  [getters.getTotalReports]: ({ reports }) => (unitID) => {
    return reports.filter(({ unitID: _unitID }) => _unitID === unitID).length;
  },
  [getters.uniqueReport]: ({ reports }) => (unitID, sequentialID) => {
    return !reports.find(
      ({ data, unitID: _unitID }) =>
        _unitID === unitID && sequentialID == getField(data, "sequentialID")
    );
  },
  [getters.devReports]({ reports, theUnit }) {
    let _reports = reports.filter(({ unitID }) => unitID === theUnit);

    return theUnit ? _reports : [];
  },
  [getters.devEvents](state, getters) {
    let events = getters.devReports.reduce((carry, { data }) => {
      return carry.concat(
        ...EVENT_LIST.filter(({ bit }) =>
          parseEvent(getField(data, "eventsGroup"), bit)
        ).map(({ name }) => ({
          seqID: getField(data, "sequentialID"),
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
