import * as mutations from "./mutation-types";

export default {
  [mutations.SET_LOADING](state, payload) {
    state.loading = payload;
  },
  [mutations.TOGGLE_TIME_CALIBRATION](state) {
    state.timeCalibration = !state.timeCalibration;
  },
  [mutations.CLEAR_ALL](state) {
    // state.theUnit = null
    state.theReport = null;

    // state.units = []
    state.reports = [];
    state.commands = [];
    // state.fingers = []
  },
  [mutations.SET_THE_UNIT](state, payload) {
    state.theUnit = payload;
  },
  [mutations.SET_THE_REPORT](state, payload) {
    state.theReport = payload;
  },
  [mutations.SET_COMMAND_BUFFER](state, data) {
    state.cmdBuffer = data;
  },
  [mutations.CLEAR_COMMAND_BUFFER](state) {
    state.cmdBuffer = null;
  },
  [mutations.SET_THE_COMMAND](state, data) {
    state.cmdBuffer = data.payload;
    state.theCommand = data;
  },
  [mutations.CLEAR_THE_COMMAND](state) {
    state.theCommand = null;
  },
  [mutations.ADD_UNITS](state, payload) {
    let unit = state.units.find((unitID) => unitID === payload);

    if (!unit) state.units.unshift(payload);
    if (!state.theUnit) state.theUnit = payload;
  },
  [mutations.ADD_REPORTS](state, payload) {
    state.reports.unshift(payload);
  },
  [mutations.ADD_COMMANDS](state, payload) {
    state.commands.unshift(payload);
  },
  [mutations.ADD_FINGERS](state, payload) {
    state.fingers.unshift(payload);
  },
  [mutations.DELETE_FINGERS](state, payload) {
    let index = state.fingers.findIndex(
      ({ unitID, fingerID }) =>
        unitID === payload.unitID && fingerID === payload.fingerID
    );
    state.fingers.splice(index, 1);
  },
  [mutations.RESET_FINGERS](state, payload) {
    state.fingers = state.fingers.filter(
      ({ unitID }) => unitID !== payload.unitID
    );
  },
};
