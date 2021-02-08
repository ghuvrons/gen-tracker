import { groupBy } from "lodash";
import { EVENT_LIST, parseEvent } from "components/js/event";
import { unix2time } from "components/js/utils";
import * as getters from "./getter-types";

export default {
  [getters.getTotalReports]: ({ reports }) => (theUnitID) => {
    return reports.filter(({ unitID }) => unitID.val === theUnitID).length;
  },
  [getters.devReports]({ reports, device }) {
    let devReports = reports.filter(
      ({ unitID }) => unitID.val === device.unitID
    );
    return device ? devReports : [];
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

  [getters.devResponses]({ responses, device }) {
    return device
      ? responses.filter(({ unitID }) => unitID === device.unitID)
      : [];
  },

  [getters.devFingers]({ fingers, device }) {
    return device
      ? fingers.filter(({ unitID }) => unitID === device.unitID)
      : [];
  },
};
