import * as mutations from "./mutation-types";
import initialState from "./state";

export default {
  [mutations.SET_DARKER](state, value) {
    state.darker = value;
  },
  [mutations.SET_FOLLOW](state, value) {
    state.follow = value;
  },
  [mutations.SET_TREE](state, value) {
    state.tree = value;
  },
  [mutations.SET_NOTIFICATION](state, value) {
    state.notification = value;
  }
};
