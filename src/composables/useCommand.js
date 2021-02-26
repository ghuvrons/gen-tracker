import config from "src/js/opt/config";
import { notify } from "src/js/framework";
import { buildCommand, parseCommand } from "src/js/command";
import { STOP_COMMAND } from "src/store/db/action-types";

import { max } from "lodash";
import { ref, watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useGetters, useActions } = createNamespacedHelpers("db");

export default function({ executor, publisher, handleResponse }) {
  const interval = ref(null);
  const notifier = ref(null);

  const { command } = useState(["command"]);
  const { devDevice } = useGetters(["devDevice"]);
  const { [STOP_COMMAND]: stopCommand } = useActions([STOP_COMMAND]);

  const starWaitting = exec => {
    interval.value = setTimeout(
      handleResponse,
      max([exec.timeout, config.command.timeout]) * 1000,
      null
    );
    notifier.value = notify("Sending command....", "info", 0);
    executor.value = exec;
  };
  const stopWaitting = () => {
    if (executor.value) executor.value = null;
    if (notifier.value) notifier.value();
    if (interval.value) clearTimeout(interval.value);
  };

  watch(
    () => command.value.exec,
    exec => {
      if (!exec) return stopWaitting();
      if (!devDevice.value) return notify("No device.");
      if (executor.value) return notify("Command busy.");

      let { payload } = command.value;
      let cmd = parseCommand(payload);
      if (typeof cmd === "string") {
        stopCommand();
        return notify(cmd);
      }

      let { unitID } = devDevice.value;
      let hexCmd = buildCommand(cmd, unitID);
      let binCmd = Buffer.from(hexCmd, "hex");

      starWaitting({
        ...cmd,
        unitID,
        payload,
        hexCmd
      });

      console.log(`COMMAND ${hexCmd}`);
      publisher({ unitID, binCmd });
    },
    { lazy: false }
  );
}
