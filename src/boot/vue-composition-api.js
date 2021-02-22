// import something here
import VeuCompositionAPI from "@vue/composition-api";

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VeuCompositionAPI);
};
