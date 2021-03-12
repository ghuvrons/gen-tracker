import { INSERT_RESPONSE } from "src/store/db/action-types";
import { getValue } from "src/js/utils";
import {
  notifyResponse,
  makeResponse,
  parseResponse,
  validResponse,
  RESCODES,
} from "src/js/response";
import { validateFrame } from "src/js/frame";
import config from "src/js/opt/config";

import { get } from "lodash";
import { watch, computed } from "vue";
import { useStore } from "vuex";

export default function ({ publisher, awaitCommand, handleFinger }) {
  const store = useStore();
  const devices = computed(() => store.state.db.devices);
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const insertResponse = (v) => store.dispatch(INSERT_RESPONSE, v);

  const processResponse = (command, response) => {
    if (!awaitCommand.value) return;

    const resp = makeResponse(response);
    notifyResponse(resp);

    const { unitID, sendDatetime, code, subCode, payload, status } = command;

    insertResponse({
      unitID,
      sendDatetime,
      code,
      subCode,
      payload,
      ...resp,
    });
  };
  const handleResponse = (data, topic) => {
    const hex = data.toString("hex").toUpperCase();
    if (!hex) return;
    if (!validateFrame(hex, config.prefix.response))
      return console.error(`CORRUPT ${hex}`);

    const response = parseResponse(hex);
    const unitID = getValue(response, "unitID");

    const device = devices.value.find((dev) => dev.unitID === unitID);
    if (!device) return;

    if (!awaitCommand.value) return console.error(`RESPONSE ${hex}`);
    console.warn(`RESPONSE ${hex}`);

    const { lastCommand } = device;
    if (!validResponse(lastCommand, response)) return;
    processResponse(lastCommand, response);
    publisher(unitID, null);
  };
  const ignoreResponse = (resCode) => {
    const lastCommand = get(devDevice.value, "lastCommand");
    const { unitID } = devDevice.value;

    processResponse(lastCommand, resCode || RESCODES.CANCELLED);
    publisher(unitID, null);
  };

  watch(
    () => devDevice.value,
    (dev) => {
      const lastCommand = get(dev, "lastCommand");
      if (!lastCommand) return;

      if (awaitCommand.value) return;
      if (lastCommand.resCode != RESCODES.OK) return;

      handleFinger(lastCommand);
    },
    { deep: true }
  );

  return {
    ignoreResponse,
    handleResponse,
  };
}
