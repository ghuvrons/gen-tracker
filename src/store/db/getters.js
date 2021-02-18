import { eventHistories } from "components/js/event";
import { lastSendDatetime } from "components/js/report";
import * as getters from "./getter-types";

export default {
  [getters.reportIdxByUnitID]: ({ reports }) => {
    return reports.reduce((map, { unitID }, index) => {
      map[unitID.val] = map[unitID.val] || [];
      map[unitID.val].push(index);
      return map;
    }, {});
  },
  [getters.reportByUnitID]: (state, getters) => unitID => {
    return (getters.reportIdxByUnitID[unitID] || []).map(
      index => state.reports[index]
    );
  },

  [getters.getTotalReports]: (state, getters) => unitID => {
    return getters.reportByUnitID(unitID).length;
  },
  [getters.getLastReport]: (state, getters) => unitID => {
    let report = getters.reportByUnitID(unitID)[0];
    return lastSendDatetime(report);
  },
  [getters.devEvents]({ unitID }, getters) {
    return eventHistories(getters.reportByUnitID(unitID));
  },
  [getters.devReports]({ unitID }, getters) {
    return getters.reportByUnitID(unitID);
  },
  [getters.devDevice]({ devices, unitID }) {
    return devices.find(device => device.unitID === unitID);
  },
  [getters.devResponses]({ responses, unitID }) {
    return responses.filter(response => response.unitID === unitID);
  },
  [getters.devFingers]({ fingers, unitID }) {
    return fingers.filter(finger => finger.unitID === unitID);
  }
};
