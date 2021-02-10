import * as actions from "./action-types";
import * as mutations from "./mutation-types";
import { SET_LOADING } from "src/store/common/mutation-types";

export default {
  [actions.INSERT_REPORTS]({ state, commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID.val });
    if (!state.unitID) commit(mutations.SET_UNITID, payload.unitID.val);
    commit(mutations.ADD_REPORTS, payload);
    // hooks
  },
  [actions.INSERT_RESPONSES]({ state, commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID });
    commit(mutations.ADD_RESPONSES, payload);
  },
  [actions.INSERT_COMMAND]({ state, commit }, payload) {
    let command = {
      exec: true,
      ...payload,
    };
    commit(mutations.SET_COMMAND, command);
    commit(`common/${SET_LOADING}`, command.exec, { root: true });
  },
};
