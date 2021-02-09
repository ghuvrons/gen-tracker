import { groupBy } from "lodash";
import { EVENT_LIST, parseEvent } from "components/js/event";
import { unix2time } from "components/js/utils";
import moment from "moment";
import * as getters from "./getter-types";

export default {
  [getters.devTotalReports]: ({ reports }) => (theUnitID) => {
    return reports.filter(({ unitID }) => unitID.val === theUnitID).length;
  },
  [getters.devLastFinger]: ({ device }) => {
    if (!device.fingerTime) return "Unknown";
    return moment(device.fingerTime, "X").format("DD-MM-YY HH:mm:ss");
  },
  [getters.devLastReport]: ({ reports }) => (theUnitID) => {
    let report = reports.find(({ unitID }) => unitID.val === theUnitID);

    if (report)
      return moment(report.sendDatetime.val, "X").endOf("second").fromNow();
    return "?";
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
