import config from "src/js/opt/config";
import { dilation } from "src/js/utils";
import { notify } from "src/js/framework";
import { buildCommand, parseCommand } from "src/js/command";
// import { STOP_COMMAND } from "src/store/db/action-types";

import dayjs from "src/js/dayjs";
import { get, max } from "lodash";
import { ref, watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useGetters } = createNamespacedHelpers("db");

export default function({ executor, publisher, handleResponse }) {
  const ticker = ref(null);
  const interval = ref(null);
  const notifier = ref(null);

  const { commands } = useState(["commands"]);
  const { devDevice } = useGetters(["devDevice"]);
  // const { [STOP_COMMAND]: stopCommand } = useActions([STOP_COMMAND]);

  const starWaitting = exec => {
    ticker.value = dayjs().unix();
    interval.value = setTimeout(
      handleResponse,
      max([exec.timeout, config.command.timeout]) * 1000,
      null
    );
    notifier.value = notify("Sending command....", "info", 0);
    executor.value = exec;
  };
  const stopWaitting = () => {
    // stopCommand();
    if (executor.value) {
      publisher(executor.value.unitID, null);
      executor.value = null;
    }
    if (notifier.value) notifier.value();
    if (interval.value) clearTimeout(interval.value);
  };
  const handleLostCommand = report => {
    if (!executor.value) return;
    if (get(executor.value, "timeout") < 60) return;

    let { sendDatetime, unitID } = report;
    if (executor.value.unitID != unitID.val) return;

    if (dilation(ticker.value, "seconds", sendDatetime.val) < 10) return;

    notify("Command lost.", "warning");
    stopWaitting();
  };

  watch(
    () => commands.value.length,
    (curLen, oldLen) => {
      if (curLen > oldLen) {
        const { unitID, hexCmd } = commands.value[0];
        const binCmd = Buffer.from(hexCmd, "hex");

        console.log(`COMMAND ${hexCmd}`);
        publisher(unitID, binCmd);
      }
    },
    { deep: true }
  );

  // watch(
  //   () => command.value.exec,
  //   exec => {
  //     if (!exec || !devDevice.value || !commandable.value || executor.value) {
  //       stopWaitting();
  //       if (!exec) return;
  //       if (!devDevice.value) return notify("No device.");
  //       if (!commandable.value) return notify("Someone commanding");
  //       if (executor.value) return notify("Command busy.");
  //     }
  //     let { payload } = command.value;
  //     let cmd = parseCommand(payload);
  //     if (typeof cmd === "string") {
  //       stopWaitting();
  //       return notify(cmd);
  //     }

  //     let { unitID } = devDevice.value;
  //     let hexCmd = buildCommand(cmd, unitID);
  //     let binCmd = Buffer.from(hexCmd, "hex");

  //     starWaitting({
  //       ...cmd,
  //       unitID,
  //       payload,
  //       hexCmd
  //     });

  //     console.log(`COMMAND ${hexCmd}`);
  //     publisher(unitID, binCmd);
  //   },
  //   { lazy: false, immediate: true }
  // );

  return {
    cancelCommand,
    handleLostCommand
  };
}
