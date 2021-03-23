import { INSERT_RESPONSE } from "src/store/db/action-types";
import { getValue, log } from "src/js/utils";
import {
  notifyResponse,
  makeResponse,
  parseResponse,
  validResponse,
  RESCODES,
} from "src/js/response";
import { validateFrame } from "src/js/frame";
import config from "src/js/opt/config";

import { watch, computed } from "vue";
import { useStore } from "vuex";

export default function ({ awaitCommand, flushCommand, handleFinger }) {
  const store = useStore();
  const devices = computed(() => store.state.db.devices);
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const insertResponse = (v) => store.dispatch(INSERT_RESPONSE, v);

  const processResponse = (command, response) => {
    if (!awaitCommand.value) return;

    const resp = makeResponse(response);
    notifyResponse(resp);

    const { vin, sendDatetime, code, subCode, payload } = command;

    insertResponse({
      vin,
      sendDatetime,
      code,
      subCode,
      payload,
      ...resp,
    });
  };
  const handleResponse = (hex) => {
    if (!validateFrame(hex, config.prefix.response)) {
      log("error", `RESPONSE (CORRUPT) ${hex}`);
      return;
    }

    const response = parseResponse(hex);
    const vin = getValue(response, "vin");

    const device = devices.value.find((dev) => dev.vin === vin);
    if (!device) return;

    if (!awaitCommand.value) {
      log("error", `RESPONSE ${hex}`);
      return;
    }
    log("warn", `RESPONSE ${hex}`);

    const { lastCommand } = device;
    if (!validResponse(lastCommand, response)) return;
    processResponse(lastCommand, response);
    flushCommand(vin);
  };
  const ignoreResponse = (resCode) => {
    const { vin, lastCommand } = devDevice.value ?? {};

    if (lastCommand) {
      clearInterval(lastCommand.timer);
      processResponse(lastCommand, resCode ?? RESCODES.CANCELLED);
    }
    flushCommand(vin);
  };

  watch(
    () => devDevice.value,
    (device) => {
      const { lastCommand } = device ?? {};
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
