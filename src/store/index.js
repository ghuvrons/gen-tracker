import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import { LocalStorage } from "quasar";

import db from "./db";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
const vuexLocal = new VuexPersistence({
  // storage: LocalStorage,
  storage: window.localStorage,
});

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      db,
    },
    plugins: [vuexLocal.plugin],
  });

  return Store;
}
