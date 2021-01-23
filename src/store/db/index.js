import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
  loading: false,
  calibration: false,
  theUnit: null,
  theReport: null,
  theCommand: null,
  cmdBuffer: null,
  units: [],
  reports: [],
  commands: [],
  fingers: [],
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
