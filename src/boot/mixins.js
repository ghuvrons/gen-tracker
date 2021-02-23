import { mapState } from "vuex";

export default ({ Vue }) => {
  // Vue.prototype.$config = cloneDeep(config);
  Vue.mixin({
    computed: {
      ...mapState("common", ["processing"])
    }
  });
};
