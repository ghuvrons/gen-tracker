import { dilation, getValue } from "src/js/utils";
import { notify } from "src/js/framework";
import { RESCODES } from "src/js/response";
import { buildCommand, parseCommand, validateCommand } from "src/js/command";
import { INSERT_COMMAND } from "src/store/db/action-types";

import { watch, computed, ref } from "vue";
import { useStore } from "vuex";

export default function ({
  publisher,
  awaitCommand,
  ignoreResponse,
  addDevices,
}) {
  const store = useStore();
  const commands = computed(() => store.state.db.commands);
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const insertCommand = (v) => store.dispatch(INSERT_COMMAND, v);

  const timer = ref(null);

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

    const command = buildCommand(cmd, unitID);
    insertCommand(command);
    timer.value = setTimeout(ignoreResponse, 3000, RESCODES.TIMEOUT);
  };
  const handleCommand = (data, topic) => {
    const unitID = parseInt(topic.split("/")[1]);
    const hex = data.toString("hex").toUpperCase();
    const commandable = !hex;

    console.warn(`COMMANDABLE ${unitID}, ${commandable}`);
    addDevices([{ unitID, commandable }]);
    if (commandable) return notify("Device commandable", "info");
    if (!awaitCommand.value) return;

    const { lastCommand } = devDevice.value;
    const command = parseCommand(hex);

    if (getValue(command, "sendDatetime") != lastCommand.sendDatetime) return;
    console.warn(timer.value);
    clearTimeout(timer.value);
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
    () => commands.value,
    () => {
      if (!awaitCommand.value) return;

      const { unitID, hexCmd } = commands.value[0];
      const binCmd = Buffer.from(hexCmd, "hex");

      console.log(`COMMAND ${hexCmd}`);
      publisher(unitID, binCmd);
    },
    { deep: true }
  );

  return {
    sendCommand,
    handleCommand,
    handleLostCommand,
  };
}
