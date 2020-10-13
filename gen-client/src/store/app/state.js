import { config } from "../../utils/config";
import { cloneDeep } from "lodash";

// database
export default {
  config: cloneDeep(config),
  loading: false
};
