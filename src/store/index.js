import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import VuexPersist from "vuex-persist";

import common from "./common";
import db from "./db";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const vuexLocal = ["common", "db"].map(
  (module) =>
    new VuexPersist({
      key: `${module}_key`,
      storage: window.localStorage,
      reducer: (state) => ({ [module]: { ...state[module] } }),
    }).plugin
);

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: { common, db },
    plugins: [...vuexLocal],

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    // strict: process.env.DEBUGGING,
  });

  return Store;
});
