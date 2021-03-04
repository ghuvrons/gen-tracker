import {
  INSERT_RESPONSE
  // STOP_COMMAND
} from "src/store/db/action-types";
import {
  notifyResponse,
  parseResCode,
  mergeResponse,
  Response,
  parseResponse,
  validResponse
} from "src/js/response";

import { get } from "lodash";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
import { parseFrame } from "src/js/frame";
import { getValue } from "src/js/utils";
const { useGetters, useActions } = createNamespacedHelpers("db");

export default function({ executor, publisher, handleFinger }) {
  const { devDevice, getDeviceByUnitID } = useGetters([
    "devDevice",
    "getDeviceByUnitID"
  ]);
  const {
    [INSERT_RESPONSE]: insertResponse
    // [STOP_COMMAND]: stopCommand
  } = useActions([
    INSERT_RESPONSE
    // STOP_COMMAND
  ]);

  const handleResponse = hex => {
    let response = parseResponse(hex);
    const unitID = getValue(response, "unitID");

    const device = getDeviceByUnitID.value(unitID);
    if (!device) return;

    const { commanding, lastCommand } = device;
    if (!commanding) return console.error(`RESPONSE ${hex}`);
    // if (!executor.value) return console.error(`RESPONSE ${hex}`);
    console.warn(`RESPONSE ${hex}`);

    if (!validResponse(lastCommand, response)) return;
    response = mergeResponse(lastCommand, response, hex);

    notifyResponse(response.resCode);
    insertResponse(response);
    publisher(unitID, null);
    // stopCommand();
  };

  watch(
    () => devDevice.value,
    dev => {
      const lastCommand = get(dev, "lastCommand");
      if (!lastCommand) return;

      if (!lastCommand.hasOwnProperty("resCode")) return;

      let res = parseResCode(lastCommand.resCode);
      if (res.title != "OK") return;

      handleFinger(lastCommand);
    },
    { deep: true }
  );

  return {
    handleResponse
  };
}
