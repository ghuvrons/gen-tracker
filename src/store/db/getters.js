import { eventHistories } from "src/js/event";

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

  getDeviceByUnitID: ({ devices }, getters) => unitID => {
    return devices.find(device => device.unitID === unitID);
  },

  devReports({ unitID }, getters) {
    return getters.reportByUnitID(unitID);
  },
  devEvents(state, getters) {
    return eventHistories(getters.devReports);
  },
  devDevice({ devices, unitID }) {
    return devices.find(device => device.unitID === unitID);
  },
  devCommands({ commands, unitID }) {
    return commands.filter(command => command.unitID === unitID);
  },
  devResponses({ responses, unitID }) {
    return responses.filter(response => response.unitID === unitID);
  },
  devFingers({ fingers, unitID }) {
    return fingers.filter(finger => finger.unitID === unitID);
  }
};
