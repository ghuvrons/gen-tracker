import * as actions from "./action-types";
import * as mutations from "./mutation-types";
import { frameId, mod } from "src/js/utils";

export default {
  [mod(actions.INSERT_BUFFERS)]({ state, commit }, payloads) {
    if (payloads.length > 1) commit(mod(mutations.START_BUFFERING));
    commit(mod(mutations.ADD_BUFFERS), payloads);
  },
  [mod(actions.INSERT_REPORTS)]({ state, commit }, payloads) {
    if (payloads.length > 1) commit(mod(mutations.START_BUFFERING));

    commit(mod(mutations.ADD_REPORTS), payloads.slice().reverse());
    commit(
      mod(mutations.ADD_DEVICES),
      payloads.map((payload) => ({
        unitID: payload.unitID.val,
        sendDatetime: payload.sendDatetime.val,
        lastReport: payload,
        ...(frameId(payload.frameID.val) == "FULL" && {
          lastFullReport: payload,
        }),
      }))
    );
  },

  [mod(actions.INSERT_COMMAND)]({ commit }, payload) {
    commit(mod(mutations.ADD_COMMANDS), payload);
    commit(mod(mutations.ADD_DEVICES), [
      {
        unitID: payload.unitID,
        lastCommand: payload,
      },
    ]);
  },
  [mod(actions.INSERT_RESPONSE)]({ state, commit }, payload) {
    commit(mod(mutations.ADD_RESPONSE), payload);
    commit(mod(mutations.ADD_DEVICES), [
      {
        unitID: payload.unitID,
        lastCommand: payload,
      },
    ]);
  },
};
