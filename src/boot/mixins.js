import CommonMixin from "components/js/mixins/CommonMixin";

export default ({ Vue }) => {
  // Vue.prototype.$config = cloneDeep(config);
  Vue.mixin(CommonMixin);
};
