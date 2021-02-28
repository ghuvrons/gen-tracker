import * as actions from "./action-types";
import * as mutations from "./mutation-types";
import { SET_PROCESSING } from "src/store/common/mutation-types";
import { frameId } from "src/js/utils";

export default {
  [actions.INSERT_REPORTS]({ state, commit }, payloads) {
    if (!Array.isArray(payloads)) payloads = [payloads];

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
  [actions.INSERT_RESPONSES]({ state, commit, dispatch }, payload) {
    commit(mutations.ADD_RESPONSES, payload);
    commit(mutations.ADD_DEVICES, {
      unitID: payload.unitID,
      lastResponse: payload
    });
  },
  [actions.INSERT_COMMAND]({ state, commit }, payload) {
    let command = {
      exec: true,
      ...payload
    };
    commit(mutations.SET_COMMAND, command);
    commit(`common/${SET_PROCESSING}`, command.exec, { root: true });
  },
  [actions.STOP_COMMAND]({ state, commit }) {
    commit(mutations.SET_COMMAND, {
      ...state.command,
      exec: false
    });
    commit(`common/${SET_PROCESSING}`, false, { root: true });
  }
};
