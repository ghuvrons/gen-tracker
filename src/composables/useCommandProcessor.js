import config from "src/js/opt/config";
import { notify } from "src/js/framework";
import { parseResponse, notifyResponse } from "src/js/response";
import { INSERT_RESPONSES, STOP_COMMAND } from "src/store/db/action-types";

import { get } from "lodash";
import { ref } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default function() {
  const executor = ref(null);
  const interval = ref(null);
  const notifier = ref(null);

  const { useActions } = createNamespacedHelpers("db");
  const {
    [INSERT_RESPONSES]: insertResponses,
    [STOP_COMMAND]: stopCommand
  } = useActions([INSERT_RESPONSES, STOP_COMMAND]);

  const starWaitting = exec => {
    let { timeout } = config.command;

    executor.value = exec;
    interval.value = setTimeout(
      cmdTimeout,
      (exec.timeout > timeout ? exec.timeout : timeout) * 1000
    );
    notifier.value = notify("Sending command....", "info", 0);
  };
  const stopWaitting = () => {
    if (notifier.value) notifier.value();
    if (interval.value) clearTimeout(interval.value);
    if (executor.value) executor.value = null;
  };
  const cmdTimeout = () => {
    let response = parseResponse(executor.value, null);
    notifyResponse(response);
    insertResponses(response);
    stopCommand();
  };
  const handleResponse = hex => {
    let response = parseResponse(executor.value, hex);
    if (get(response, "unitID") !== executor.value.unitID) return;

    notifyResponse(response);
    insertResponses(response);
    stopCommand();
  };

  return {
    executor,

    starWaitting,
    stopWaitting,
    handleResponse
  };
}
