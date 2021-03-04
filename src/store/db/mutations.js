import * as mutations from "./mutation-types";
import initialState from "./state";
import config from "src/js/opt/config";
import { orderBy } from "lodash";
import { loader } from "src/js/framework";

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

  [mutations.ADD_DEVICES](state, payloads) {
    payloads.forEach(payload => {
      let idx = state.devices.findIndex(
        ({ unitID }) => unitID === payload.unitID
      );

      if (idx < 0)
        state.devices.unshift({
          status: 0,
          sendDatetime: 0,
          commandable: true,
          ...payload
        });
      else
        state.devices.splice(idx, 1, {
          ...state.devices[idx],
          ...payload
        });
    });

    if (!state.unitID) state.unitID = payloads[payloads.length - 1].unitID;
  },

  [mutations.START_BUFFERING](state) {
    if (!state.buffering)
      state.buffering = loader("Syncing...", "Please wait a moment");
  },
  [mutations.STOP_BUFFERING](state) {
    if (state.buffering) {
      state.buffering.hide();
      state.buffering = null;
    }
  },
  [mutations.ADD_BUFFERS](state, payloads) {
    state.buffers.push(...payloads);
  },
  [mutations.FREE_BUFFER](state, hexs) {
    state.buffers = [...state.buffers.filter(hex => !hexs.includes(hex))];
  },

  [mutations.ADD_REPORTS](state, payloads) {
    const freezed = payloads.map(payload => Object.freeze(payload));

    state.reports = [
      ...orderBy([...state.reports, ...freezed], "logDatetime.val", "desc")
    ];

    if (state.reports.length > config.maxStorage.reports - 1)
      state.reports.splice(
        config.maxStorage.reports,
        state.reports.length - config.maxStorage.reports
      );
  },
  [mutations.ADD_COMMANDS](state, payload) {
    state.commands.unshift(payload);

    if (state.commands.length > config.maxStorage.commands)
      state.commands.pop();
  },
  [mutations.ADD_RESPONSE](state, payload) {
    let idx = state.commands.findIndex(
      ({ unitID }) => unitID === payload.unitID
    );

    if (idx >= 0) state.commands.splice(idx, 1, payload);
  },
  [mutations.ADD_RESPONSES](state, payload) {
    const freezed = { ...payload };
    Object.freeze(freezed);

    state.responses.unshift(freezed);

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
