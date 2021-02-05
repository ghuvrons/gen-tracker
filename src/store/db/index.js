import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
// import { LocalStorage } from "quasar";

const state = {
  loading: false,
  // darker: LocalStorage.get.item("darker") || false,
  darker: false,
  calibration: true,
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
