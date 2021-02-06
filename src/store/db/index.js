import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
  loading: false,
  darker: false,
  calibration: false,
  theCmdBuffer: null,

  theUnit: null,
  theReport: null,
  theCommand: null,

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
