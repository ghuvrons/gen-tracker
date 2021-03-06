import { dilation } from "src/js/utils";
import { notify } from "src/js/framework";
import { RESCODES } from "src/js/response";
import { awaitCommand, buildCommand, parseCommand } from "src/js/command";
import { INSERT_COMMAND } from "src/store/db/action-types";

import { get } from "lodash";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useGetters, useActions } = createNamespacedHelpers("db");

export default function({ publisher, ignoreResponse }) {
  const { commands } = useState(["commands"]);
  const { devDevice } = useGetters(["devDevice"]);
  const { [INSERT_COMMAND]: insertCommand } = useActions([INSERT_COMMAND]);

  const sendCommand = payload => {
    if (!payload) return notify("No payload");
    if (!devDevice.value) return notify("No device");

    const { unitID, status, commandable, lastCommand } = devDevice.value;
    if (lastCommand && awaitCommand(lastCommand)) return notify("Command busy");
    // if (!status) return notify("Device offline");
    if (!commandable) return notify("Device busy");

    payload = payload.toUpperCase();
    const cmd = parseCommand(payload);
    if (!cmd) return;

    if (typeof cmd === "string") return notify(cmd);

    insertCommand(buildCommand(cmd, unitID));
  };
  const handleLostCommand = report => {
    const lastCommand = get(devDevice.value, "lastCommand");
    if (!awaitCommand(lastCommand)) return;

    const { sendDatetime, unitID, timeout } = lastCommand;
    if (unitID != report.unitID.val) return;

    const timeDiff = dilation(sendDatetime, "seconds");

    if (timeout < 30) {
      if (timeDiff > timeout) ignoreResponse(RESCODES.TIMEOUT);
    } else {
      if (timeDiff > 30) ignoreResponse(RESCODES.UNKNOWN);
    }
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
    handleLostCommand
  };
}
