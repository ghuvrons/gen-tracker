import * as actions from "./action-types";
import * as mutations from "./mutation-types";

export default {
  [actions.RESET_DATABASE]({ commit }) {
    commit(mutations.CLEAR_ALL);
    commit(mutations.CLEAR_COMMAND);
    commit(mutations.CLEAR_BUFFER);
  },
  [actions.INSERT_REPORTS]({ commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID.val });
    commit(mutations.ADD_REPORTS, payload);
  },
  [actions.INSERT_RESPONSES]({ commit }, payload) {
    commit(mutations.ADD_DEVICES, { unitID: payload.unitID });
    commit(mutations.ADD_RESPONSES, payload);
  },
  [actions.INSERT_FINGERS]({ commit, state }, { unitID, ids }) {
    commit(mutations.TAKE_FINGER_TIME, state.device);
    ids.forEach((id) =>
      commit(mutations.ADD_FINGERS, { unitID, fingerID: id })
    );
  },
};
