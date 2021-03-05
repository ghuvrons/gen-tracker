import * as actions from "./action-types";
import * as mutations from "./mutation-types";
import { frameId } from "src/js/utils";

export default {
  [actions.INSERT_BUFFERS]({ state, commit }, payloads) {
    if (payloads.length > 1) commit(mutations.START_BUFFERING);

    commit(mutations.ADD_BUFFERS, payloads);
  },
  [actions.INSERT_REPORTS]({ state, commit }, payloads) {
    if (payloads.length > 1) commit(mutations.START_BUFFERING);

    commit(mutations.ADD_REPORTS, payloads.slice().reverse());
    commit(
      mutations.ADD_DEVICES,
      payloads.map(payload => ({
        unitID: payload.unitID.val,
        sendDatetime: payload.sendDatetime.val,
        lastReport: payload,
        ...(frameId(payload.frameID.val) == "FULL" && {
          lastFullReport: payload
        })
      }))
    );
  },

  [actions.INSERT_COMMAND]({ commit }, payload) {
    commit(mutations.ADD_COMMANDS, payload);
    commit(mutations.ADD_DEVICES, [
      {
        unitID: payload.unitID,
        lastCommand: payload
      }
    ]);
  },
  [actions.INSERT_RESPONSE]({ state, commit }, payload) {
    commit(mutations.ADD_RESPONSE, payload);
    commit(mutations.ADD_DEVICES, [
      {
        unitID: payload.unitID,
        lastCommand: payload
      }
    ]);
  }
};
