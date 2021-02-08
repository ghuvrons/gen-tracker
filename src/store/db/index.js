import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
  loading: false,
  darker: false,
  tree: false,
  calibration: false,

  theCmdBuffer: null,

  theDevice: null,
  theReport: null,
  theCommand: null,

  devices: [],
  reports: [],
  responses: [],
  fingers: [],
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
