import { groupBy } from "lodash";
import { EVENT_LIST, parseEvent } from "components/js/event";
import moment from "moment";
import * as getters from "./getter-types";

export default {
  [getters.indexByUnitID]: ({ reports }) => {
    return reports.reduce((map, item, index) => {
      map[item.unitID.val] = map[item.unitID.val] || [];
      map[item.unitID.val].push(index);
      return map;
    }, {});
  },
  [getters.byUnitID]: (state, getters) => (unitID) => {
    return (getters.indexByUnitID[unitID] || []).map(
      (index) => state.reports[index]
    );
  },

  [getters.devTotalReports]: (state, getters) => (unitID) => {
    return getters.byUnitID(unitID).length;
  },
  [getters.devLastReport]: (state, getters) => (unitID) => {
    let report = getters.byUnitID(unitID)[0];

    if (report)
      return moment.unix(report.sendDatetime.val).endOf("second").fromNow();
    return "Unknown ago";
  },
  [getters.devReports]({ unitID }, getters) {
    return getters.byUnitID(unitID);
  },
  [getters.devEvents]({ unitID }, getters) {
    return groupBy(
      getters.byUnitID(unitID).reduce(
        (carry, { eventsGroup, logDatetime }) =>
          carry.concat(
            ...EVENT_LIST.filter(({ bit }) =>
              parseEvent(eventsGroup.val, bit)
            ).map(({ name }) => ({
              time: moment.unix(logDatetime.val).format("HH:mm:ss"),
              name,
            }))
          ),
        []
      ),
      "name"
    );
  },
  [getters.devDevice]({ devices, unitID }) {
    return devices.find((device) => device.unitID === unitID);
  },
  [getters.devResponses]({ responses, unitID }) {
    return unitID
      ? responses.filter((response) => response.unitID === unitID)
      : [];
  },
  [getters.devFingers]({ fingers, unitID }) {
    return unitID ? fingers.filter((finger) => finger.unitID === unitID) : [];
  },
};
