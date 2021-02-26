import * as actions from "./action-types";
import * as mutations from "./mutation-types";
import { SET_PROCESSING } from "src/store/common/mutation-types";

export default {
  [actions.INSERT_DEVICES]({ state, commit }, payload) {
    commit(mutations.ADD_DEVICES, payload);
    if (!state.unitID) commit(mutations.SET_UNITID, payload.unitID);
  },
  [actions.INSERT_REPORTS]({ state, commit, dispatch }, payload) {
    dispatch(actions.INSERT_DEVICES, { unitID: payload.unitID.val });
    commit(mutations.ADD_REPORTS, payload);
  },
  [actions.INSERT_RESPONSES]({ state, commit, dispatch }, payload) {
    dispatch(actions.INSERT_DEVICES, { unitID: payload.unitID });
    commit(mutations.ADD_RESPONSES, payload);
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
