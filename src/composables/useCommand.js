import { dilation } from "src/js/utils";
import { notify } from "src/js/framework";
import { RESCODES } from "src/js/response";
import { buildCommand, validateCommand } from "src/js/command";
import { INSERT_COMMAND } from "src/store/db/action-types";

import { computed, watch } from "vue";
import { createNamespacedHelpers } from "vuex";
const { useState, useGetters, useActions } = createNamespacedHelpers("db");

export default function ({ publisher, awaitCommand, ignoreResponse }) {
  const { commands } = useState(["commands"]);
  const { devDevice } = useGetters(["devDevice"]);
  const { [INSERT_COMMAND]: insertCommand } = useActions([INSERT_COMMAND]);

  const timeoutCommand = () => {
    ignoreResponse(RESCODES.TIMEOUT);
  };
  const sendCommand = (payload) => {
    if (!payload) return notify("No payload");
    if (!devDevice.value) return notify("No device");

    const { unitID, status, commandable } = devDevice.value;
    if (awaitCommand.value) return notify("Command busy");
    // if (!status) return notify("Device offline");
    if (!commandable) return notify("Device busy");

    payload = payload.toUpperCase();
    const cmd = validateCommand(payload);
    if (!cmd) return;

    if (typeof cmd === "string") return notify(cmd);

    const timer = setTimeout(timeoutCommand, 3000);
    const command = buildCommand(cmd, unitID);
    insertCommand({ ...command, timer });
  };
  const handleLostCommand = (report) => {
    // if (!awaitCommand.value) return;
    // const { lastCommand } = devDevice.value;
    // const { sendDatetime, unitID, timeout } = lastCommand;
    // if (unitID != report.unitID.val) return;
    // const timeDiff = dilation(sendDatetime, "seconds");
    // if (timeout < 30) {
    //   if (timeDiff > timeout) ignoreResponse(RESCODES.TIMEOUT);
    // } else {
    //   if (timeDiff > 30) ignoreResponse(RESCODES.UNKNOWN);
    // }
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

  return {
    sendCommand,
    handleLostCommand,
  };
}
