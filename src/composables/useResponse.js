import { INSERT_RESPONSES, STOP_COMMAND } from "src/store/db/action-types";
import { notifyResponse, parseResCode, parseResponse } from "src/js/response";

import { get } from "lodash";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters, useActions } = createNamespacedHelpers("db");

export default function({ executor, handleFinger }) {
  const { devDevice } = useGetters(["devDevice"]);
  const {
    [INSERT_RESPONSES]: insertResponses,
    [STOP_COMMAND]: stopCommand
  } = useActions([INSERT_RESPONSES, STOP_COMMAND]);

  const handleResponse = hex => {
    if (!executor.value) return console.error(`RESPONSE ${hex}`);
    console.warn(`RESPONSE ${hex}`);

    let response = parseResponse(executor.value, hex);
    if (get(response, "unitID") !== executor.value.unitID) return;

    notifyResponse(response);
    insertResponses(response);
    stopCommand();
  };

  watch(
    () => devDevice.value,
    dev => {
      const lastResponse = get(dev, "lastResponse");
      if (!lastResponse) return;

      let res = parseResCode(lastResponse.resCode);
      if (res.title != "OK") return;

      handleFinger(lastResponse);
    },
    { deep: true }
  );

  return {
    handleResponse
  };
}
