import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import common from "./common";
import db from "./db";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
const vuexLocal = new VuexPersistence({
  key: "STORAGE_KEY",
  storage: window.localStorage,
  reducer: state => ({
    common: { ...state.common }
  })
});

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      common,
      db
    },
    plugins: [vuexLocal.plugin],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  });

  return Store;
}
