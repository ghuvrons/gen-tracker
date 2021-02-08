import { groupBy } from "lodash";
import { EVENT_LIST, parseEvent } from "components/js/event";
import { unix2time } from "components/js/utils";
import * as getters from "./getter-types";

export default {
  [getters.getTotalReports]: ({ reports }) => (theUnitID) => {
    return reports.filter(({ unitID }) => unitID.val === theUnitID).length;
  },
  [getters.devReports]({ reports, theDevice }) {
    let _reports = reports.filter(
      ({ unitID }) => unitID.val === theDevice.unitID
    );
    return theDevice ? _reports : [];
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

  [getters.devResponses]({ responses, theDevice }) {
    return theDevice
      ? responses.filter(({ unitID }) => unitID === theDevice.unitID)
      : [];
  },

  [getters.devFingers]({ fingers, theDevice }) {
    return theDevice
      ? fingers.filter(({ unitID }) => unitID === theDevice.unitID)
      : [];
  },
};
