import CommonMixin from "components/mixins/CommonMixin";

export default ({ Vue }) => {
  // Vue.prototype.$config = cloneDeep(config);
  Vue.mixin(CommonMixin);
};
