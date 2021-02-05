import * as actions from "./action-types";

export default {
  [actions.RESET_DATABASE]({ commit }) {
    commit("CLEAR_ALL");
    commit("CLEAR_THE_COMMAND");
    commit("CLEAR_THE_CMD_BUFFER");
  },
};
