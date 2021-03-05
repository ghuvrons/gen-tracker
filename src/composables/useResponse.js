import { INSERT_RESPONSE } from "src/store/db/action-types";
import { getValue } from "src/js/utils";
import { awaitCommand } from "src/js/command";
import {
  notifyResponse,
  makeResponse,
  parseResponse,
  validResponse,
  RESCODES
} from "src/js/response";

import { get } from "lodash";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters, useActions } = createNamespacedHelpers("db");

export default function({ publisher, handleFinger }) {
  const { devDevice, getDeviceByUnitID } = useGetters([
    "devDevice",
    "getDeviceByUnitID"
  ]);
  const { [INSERT_RESPONSE]: insertResponse } = useActions([INSERT_RESPONSE]);

  const processResponse = (command, response) => {
    const { unitID } = command;

    if (awaitCommand(command)) {
      const resp = makeResponse(response);
      notifyResponse(resp);
      insertResponse({ ...command, ...resp });
    }
    publisher(unitID, null);
  };
  const handleResponse = hex => {
    let response = parseResponse(hex);
    const unitID = getValue(response, "unitID");

    const device = getDeviceByUnitID.value(unitID);
    if (!device) return;

    const { lastCommand } = device;
    if (!awaitCommand(lastCommand)) return console.error(`RESPONSE ${hex}`);
    console.warn(`RESPONSE ${hex}`);

    if (!validResponse(lastCommand, response)) return;
    processResponse(lastCommand, response);
  };
  const ignoreResponse = resCode => {
    const lastCommand = get(devDevice.value, "lastCommand");
    processResponse(lastCommand, resCode || RESCODES.CANCELLED);
  };

  watch(
    () => devDevice.value,
    dev => {
      const lastCommand = get(dev, "lastCommand");
      if (!lastCommand) return;

      if (awaitCommand(lastCommand)) return;
      if (lastCommand.resCode != RESCODES.OK) return;

      handleFinger(lastCommand);
    },
    { deep: true }
  );

  return {
    ignoreResponse,
    handleResponse
  };
}
