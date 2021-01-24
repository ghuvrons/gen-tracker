import { config } from "components/js/opt/config";
import _ from "lodash";

export default ({ Vue }) => {
  Vue.prototype.$config = _.cloneDeep(config);
};
