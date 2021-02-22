import { eventHistories } from "components/js/event";
import { lastSendDatetime } from "components/js/report";
// import * as getters from "./getter-types";

export default {
  reportIdxByUnitID: ({ reports }) => {
    return reports.reduce((map, { unitID }, index) => {
      map[unitID.val] = map[unitID.val] || [];
      map[unitID.val].push(index);
      return map;
    }, {});
  },
  reportByUnitID: (state, getters) => unitID => {
    return (getters.reportIdxByUnitID[unitID] || []).map(
      index => state.reports[index]
    );
  },

  getTotalReports: (state, getters) => unitID => {
    return getters.reportByUnitID(unitID).length;
  },
  getLastReport: (state, getters) => unitID => {
    return lastSendDatetime(getters.reportByUnitID(unitID)[0]);
  },

  devEvents({ unitID }, getters) {
    return eventHistories(getters.reportByUnitID(unitID));
  },
  devReports({ unitID }, getters) {
    return getters.reportByUnitID(unitID);
  },
  devDevice({ devices, unitID }) {
    return devices.find(device => device.unitID === unitID);
  },
  devResponses({ responses, unitID }) {
    return responses.filter(response => response.unitID === unitID);
  },
  devFingers({ fingers, unitID }) {
    return fingers.filter(finger => finger.unitID === unitID);
  }
};
