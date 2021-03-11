import { mod } from "src/js/utils";
import * as mutations from "./mutation-types";
import initialState from "./state";

export default {
  [mod(mutations.SET_DARKER)](state, value) {
    state.darker = value;
  },
  [mod(mutations.SET_FOLLOW)](state, value) {
    state.follow = value;
  },
  [mod(mutations.SET_TREE)](state, value) {
    state.tree = value;
  },
  [mod(mutations.SET_NOTIFICATION)](state, value) {
    state.notification = value;
  },
};
