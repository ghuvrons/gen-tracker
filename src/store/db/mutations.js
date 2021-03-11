import * as mutations from "./mutation-types";
import initialState from "./state";
import { Platform } from "quasar";
import config from "src/js/opt/config";
import { orderBy } from "lodash";
import { loader } from "src/js/framework";
import { mod } from "src/js/utils";

export default {
  [mod(mutations.CLEAR_DATABASE)](state) {
    Object.assign(state, initialState());
  },

  [mod(mutations.SET_UNITID)](state, unitID) {
    state.unitID = unitID;
  },
  [mod(mutations.SET_REPORT)](state, payload) {
    state.report = payload;
  },

  [mod(mutations.ADD_DEVICES)](state, payloads) {
    payloads.forEach((payload) => {
      let idx = state.devices.findIndex(
        ({ unitID }) => unitID === payload.unitID
      );

      if (idx < 0)
        state.devices.unshift({
          status: 0,
          sendDatetime: 0,
          commandable: true,
          ...payload,
        });
      else
        state.devices.splice(idx, 1, {
          ...state.devices[idx],
          ...payload,
        });
    });

    if (!state.unitID) state.unitID = payloads[payloads.length - 1].unitID;
  },

  [mod(mutations.START_BUFFERING)](state) {
    if (!state.buffering)
      state.buffering = loader("Syncing...", "Please wait a moment");
  },
  [mod(mutations.STOP_BUFFERING)](state) {
    if (state.buffering) {
      try {
        state.buffering.hide();
      } catch (e) {
        console.warn(e);
      }
      state.buffering = null;
    }
  },
  [mod(mutations.ADD_BUFFERS)](state, payloads) {
    state.buffers.push(...payloads);
  },
  [mod(mutations.FREE_BUFFER)](state, hexs) {
    state.buffers = [...state.buffers.filter((hex) => !hexs.includes(hex))];
  },

  [mod(mutations.ADD_REPORTS)](state, payloads) {
    const freezed = payloads.map((payload) => Object.freeze(payload));

    state.reports = [
      ...orderBy([...state.reports, ...freezed], "logDatetime.val", "desc"),
    ];

    const max = Platform.is.desktop ? 500 : 100;
    if (state.reports.length > max - 1)
      state.reports.splice(max, state.reports.length - max);
  },
  [mod(mutations.ADD_COMMANDS)](state, payload) {
    state.commands.unshift(payload);

    const max = Platform.is.desktop ? 50 : 10;
    if (state.commands.length > max) state.commands.pop();
  },
  [mod(mutations.ADD_RESPONSE)](state, payload) {
    let idx = state.commands.findIndex(
      ({ unitID }) => unitID === payload.unitID
    );

    if (idx >= 0) state.commands.splice(idx, 1, payload);
  },

  [mod(mutations.ADD_FINGERS)](state, payload) {
    let exist = state.fingers.find(
      ({ unitID, fingerID }) =>
        unitID === payload.unitID && fingerID === payload.fingerID
    );
    if (!exist) state.fingers.unshift(payload);
  },
  [mod(mutations.REMOVE_FINGERS)](state, payload) {
    let index = state.fingers.findIndex(
      ({ unitID, fingerID }) =>
        unitID === payload.unitID && fingerID === payload.fingerID
    );
    state.fingers.splice(index, 1);
  },
  [mod(mutations.CLEAR_FINGERS)](state, payload) {
    state.fingers = state.fingers.filter(
      ({ unitID }) => unitID !== payload.unitID
    );
  },
};
