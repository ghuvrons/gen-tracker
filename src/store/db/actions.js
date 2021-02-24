import * as actions from "./action-types";
import * as mutations from "./mutation-types";
import { SET_PROCESSING } from "src/store/common/mutation-types";

export default {
  [actions.INSERT_REPORTS]({ state, commit }, payload) {
    commit(mutations.ADD_DEVICES, {
      unitID: payload.unitID.val
    });
    if (!state.unitID) commit(mutations.SET_UNITID, payload.unitID.val);
    commit(mutations.ADD_REPORTS, payload);
  },
  [actions.INSERT_RESPONSES]({ state, commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID });
    commit(mutations.ADD_RESPONSES, payload);
  },
  [actions.INSERT_DEV_STATUS]({ state, commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID });
    commit(mutations.TAKE_DEV_STATUS, payload);
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
