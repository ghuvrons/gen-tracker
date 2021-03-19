export default {
  reportIdxByVin: ({ reports }) => {
    return reports.reduce((map, { vin }, index) => {
      map[vin.val] = map[vin.val] ?? [];
      map[vin.val].push(index);
      return map;
    }, {});
  },
  reportByVin: (state, getters) => (vin) => {
    return (getters.reportIdxByVin[vin] ?? []).map(
      (index) => state.reports[index]
    );
  },

  devReports({ vin }, getters) {
    return getters.reportByVin(vin);
  },
  devDevice({ devices, vin }) {
    return devices.find((device) => device.vin === vin);
  },
  devCommands({ commands, vin }) {
    return commands.filter((command) => command.vin === vin);
  },
  devResponses({ responses, vin }) {
    return responses.filter((response) => response.vin === vin);
  },
  devFingers({ fingers, vin }) {
    return fingers.filter((finger) => finger.vin === vin);
  },
};
