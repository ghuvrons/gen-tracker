import * as actions from "./action-types";
import * as mutations from "./mutation-types";

export default {
  [actions.RESET_DATABASE]({ commit }) {
    commit(mutations.CLEAR_ALL);
    commit(mutations.CLEAR_THE_COMMAND);
    commit(mutations.CLEAR_THE_CMD_BUFFER);
  },
  [actions.INSERT_REPORTS]({ commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID.val });
    commit(mutations.ADD_REPORTS, payload);
  },
  [actions.INSERT_RESPONSES]({ commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID });
    commit(mutations.ADD_RESPONSES, payload);
  },
};
