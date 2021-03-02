import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import common from "./common";
import db from "./db";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
const vuexLocal = ["common", "db"].map(
  module =>
    new VuexPersist({
      key: `${module}_key`,
      storage: window.localStorage,
      reducer: state => ({ [module]: { ...state[module] } })
    }).plugin
);

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      common,
      db
    },
    plugins: [...vuexLocal],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  });

  return Store;
}
