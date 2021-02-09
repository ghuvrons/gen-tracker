import * as mutations from "./mutation-types";
import config from "components/js/opt/config";
import moment from "moment";

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
    state.device = null;
    state.report = null;
    state.command = null;
    state.devices = [];
    state.reports = [];
    state.responses = [];
    state.fingers = [];
  },

  [mutations.SET_DEVICE](state, payload) {
    state.device = payload;
  },
  [mutations.SET_REPORT](state, payload) {
    state.report = payload;
  },
  [mutations.SET_BUFFER](state, data) {
    state.buffer = data;
  },
  [mutations.CLEAR_BUFFER](state) {
    state.buffer = null;
  },
  [mutations.SET_COMMAND](state, data) {
    state.buffer = data.payload;
    state.command = data;
  },
  [mutations.CLEAR_COMMAND](state) {
    state.command = null;
  },

  [mutations.TAKE_FINGER_TIME](state, device) {
    let idx = state.devices.findIndex(({ unitID }) => unitID === device.unitID);

    if (idx >= 0) {
      let dev = {
        ...device,
        fingerTime: moment().unix(),
      };
      state.devices.splice(idx, 1, dev);
      if (state.device.unitID == device.unitID) state.device = dev;
    }
  },
  [mutations.ADD_DEVICES](state, payload) {
    let dev = state.devices.find(({ unitID }) => unitID === payload.unitID);

    if (!dev) state.devices.unshift(payload);
    if (!state.device) state.device = payload;
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
