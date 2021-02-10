import * as actions from "./action-types";
import * as mutations from "./mutation-types";

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
};
