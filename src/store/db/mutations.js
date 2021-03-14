import * as mutations from "./mutation-types";
import initialState from "./state";
import { Platform } from "quasar";
import { orderBy } from "lodash";
import { loader } from "src/js/framework";
import { mod } from "src/js/utils";

export default {
  [mod(mutations.CLEAR_DATABASE)](state) {
    Object.assign(state, initialState());
  },

  [mod(mutations.SET_VIN)](state, vin) {
    state.vin = vin;
  },
  [mod(mutations.SET_REPORT)](state, payload) {
    state.report = payload;
  },

  [mod(mutations.ADD_DEVICES)](state, payloads) {
    payloads.forEach((payload) => {
      const idx = state.devices.findIndex(({ vin }) => vin === payload.vin);

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

    if (!state.vin) state.vin = payloads[payloads.length - 1].vin;
  },

  [mod(mutations.START_BUFFERING)](state) {
    if (!state.buffering)
      state.buffering = loader("Syncing...", "Please wait a moment");
  },
  [mod(mutations.STOP_BUFFERING)](state) {
    if (state.buffering?.hide) state.buffering.hide();
    state.buffering = null;
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
    const idx = state.commands.findIndex(({ vin }) => vin === payload.vin);

    if (idx >= 0) {
      const freezed = { ...payload };
      Object.freeze(freezed);
      state.commands.splice(idx, 1, freezed);
    }
  },

  [mod(mutations.ADD_FINGERS)](state, payload) {
    const exist = state.fingers.find(
      ({ vin, fingerID }) =>
        vin === payload.vin && fingerID === payload.fingerID
    );
    if (!exist) state.fingers.unshift(payload);
  },
  [mod(mutations.REMOVE_FINGERS)](state, payload) {
    const idx = state.fingers.findIndex(
      ({ vin, fingerID }) =>
        vin === payload.vin && fingerID === payload.fingerID
    );
    state.fingers.splice(idx, 1);
  },
  [mod(mutations.CLEAR_FINGERS)](state, payload) {
    state.fingers = state.fingers.filter(({ vin }) => vin !== payload.vin);
  },
};
