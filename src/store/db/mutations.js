import * as mutations from "./mutation-types";
import initialState from "./state";
import config from "src/js/opt/config";

export default {
  [mutations.CLEAR_DATABASE](state) {
    Object.assign(state, initialState());
  },

  [mutations.SET_UNITID](state, unitID) {
    state.unitID = unitID;
  },
  [mutations.SET_REPORT](state, payload) {
    state.report = payload;
  },
  [mutations.SET_COMMAND](state, command) {
    state.command = command;
  },

  [mutations.ADD_DEVICES](state, payload) {
    let idx = state.devices.findIndex(
      ({ unitID }) => unitID === payload.unitID
    );

    let increment = payload.sendDatetime ? 1 : 0;

    if (idx < 0)
      state.devices.unshift({
        status: 0,
        total: increment,
        ...payload
      });
    else {
      const device = state.devices[idx];
      state.devices.splice(idx, 1, {
        ...device,
        total: device.total + increment,
        ...payload
      });
    }
  },

  [mutations.ADD_BUFFERS](state, payload) {
    const data = { ...payload };
    Object.freeze(data);
    state.buffers.push(data);
  },
  [mutations.FREE_BUFFER](state) {
    state.buffers.shift();
  },

  [mutations.ADD_REPORTS](state, payload) {
    const data = { ...payload };
    Object.freeze(data);
    state.reports.unshift(data);

    if (state.reports.length > config.maxStorage.reports) {
      let report = state.reports.pop();

      let idx = state.devices.findIndex(
        ({ unitID }) => unitID === report.unitID.val
      );

      if (idx >= 0) {
        const device = state.devices[idx];
        state.devices.splice(idx, 1, {
          ...device,
          total: device.total - 1
        });
      }
    }
  },
  [mutations.ADD_RESPONSES](state, payload) {
    const data = { ...payload };
    Object.freeze(data);
    state.responses.unshift(data);

    if (state.responses.length > config.maxStorage.responses)
      state.responses.pop();
  },

  [mutations.ADD_FINGERS](state, payload) {
    let exist = state.fingers.find(
      ({ unitID, fingerID }) =>
        unitID === payload.unitID && fingerID === payload.fingerID
    );
    if (!exist) state.fingers.unshift(payload);
  },
  [mutations.REMOVE_FINGERS](state, payload) {
    let index = state.fingers.findIndex(
      ({ unitID, fingerID }) =>
        unitID === payload.unitID && fingerID === payload.fingerID
    );
    state.fingers.splice(index, 1);
  },
  [mutations.CLEAR_FINGERS](state, payload) {
    state.fingers = state.fingers.filter(
      ({ unitID }) => unitID !== payload.unitID
    );
  }
};
