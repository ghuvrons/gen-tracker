import * as mutations from "./mutation-types";
import { config } from "components/js/opt/config";

const { maxStorage } = config;

export default {
  [mutations.SET_LOADING](state, payload) {
    state.loading = payload;
  },
  [mutations.SET_CALIBRATION](state, value) {
    state.calibration = value;
  },
  [mutations.SET_DARKER](state, value) {
    state.darker = value;
  },
  [mutations.SET_TREE](state, value) {
    state.tree = value;
  },
  [mutations.CLEAR_ALL](state) {
    state.theDevice = null;
    state.theReport = null;
    state.theCommand = null;
    state.devices = [];
    state.reports = [];
    state.responses = [];
    state.fingers = [];
  },

  [mutations.SET_THE_DEVICE](state, payload) {
    state.theDevice = payload;
  },
  [mutations.SET_THE_REPORT](state, payload) {
    state.theReport = payload;
  },
  [mutations.SET_THE_CMD_BUFFER](state, data) {
    state.theCmdBuffer = data;
  },
  [mutations.CLEAR_THE_CMD_BUFFER](state) {
    state.theCmdBuffer = null;
  },
  [mutations.SET_THE_COMMAND](state, data) {
    state.theCmdBuffer = data.payload;
    state.theCommand = data;
  },
  [mutations.CLEAR_THE_COMMAND](state) {
    state.theCommand = null;
  },

  [mutations.ADD_DEVICES](state, payload) {
    let device = state.devices.find(({ unitID }) => unitID === payload.unitID);

    if (!device) state.devices.unshift(payload);
    if (!state.theDevice) state.theDevice = payload;
  },
  [mutations.ADD_REPORTS](state, payload) {
    state.reports.unshift(payload);
    if (state.reports.length > maxStorage.reports) state.reports.pop();
  },
  [mutations.ADD_RESPONSES](state, payload) {
    state.responses.unshift(payload);
    if (state.responses.length > maxStorage.responses) state.responses.pop();
  },

  [mutations.ADD_FINGERS](state, payload) {
    let exist = state.fingers.some(
      ({ unitID, fingerID }) =>
        unitID === payload.unitID && fingerID === payload.fingerID
    );

    if (!exist) state.fingers.unshift(payload);
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
