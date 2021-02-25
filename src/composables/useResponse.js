import { INSERT_RESPONSES, STOP_COMMAND } from "src/store/db/action-types";
import { notifyResponse, parseResCode, parseResponse } from "src/js/response";

import { get } from "lodash";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useActions } = createNamespacedHelpers("db");

export default function(executor, handleFinger) {
  const { responses } = useState(["responses"]);
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
    () => responses.value[0],
    response => {
      if (!response) return;

      let res = parseResCode(response.resCode);
      if (res.title != "OK") return;

      handleFinger(response);
    }
  );

  return {
    handleResponse
  };
}
