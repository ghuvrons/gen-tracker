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
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const insertCommand = (v) => store.dispatch(INSERT_COMMAND, v);

  const sendCommand = (payload) => {
    if (!payload) return notify("No payload");
    if (!devDevice.value) return notify("No device");

    const { vin, status, commandable } = devDevice.value;
    if (awaitCommand.value) return notify("Command busy");
    // if (!status) return notify("Device offline");
    if (!commandable) return notify("Device busy");

    payload = payload.toUpperCase();
    const cmd = validateCommand(payload);
    if (!cmd) return;

    if (typeof cmd === "string") return notify(cmd);

    const { hexCmd, ...command } = buildCommand(cmd, vin);
    addDevices([{ vin, cmdStatus: "Sending..." }]);

    const binCmd = Buffer.from(hexCmd, "hex");
    console.log(`COMMAND ${hexCmd}`);
    publisher(vin, binCmd);

    insertCommand({
      ...command,
      timer: setInterval(() => {
        console.warn(`Republish command to ${vin}`);
        addDevices([{ vin, cmdStatus: "Retrying..." }]);
        publisher(vin, binCmd);
      }, 10000),
    });
  };
  const handleCommand = (data, topic) => {
    const vin = parseInt(topic.split("/")[1]);
    const hex = data.toString("hex").toUpperCase();

    const commandable = !hex;
    if (commandable) notify(`Device commandbale`, "info");

    console.warn(`COMMANDABLE ${vin}, ${commandable}`);
    addDevices([{ vin, commandable }]);
    if (!awaitCommand.value) return;

    const { lastCommand } = devDevice.value;
    const command = parseCommand(hex);

    if (getValue(command, "sendDatetime") != lastCommand.sendDatetime) return;
    if (!commandable) addDevices([{ vin, cmdStatus: "Waitting..." }]);
    else clearInterval(lastCommand.timer);
  };
  const handleCommandAck = () => {
    if (!awaitCommand.value) return;
    const { vin, lastCommand } = devDevice.value;
    addDevices([{ vin, cmdStatus: "Processing..." }]);
    console.warn("Receive command ack");
    clearInterval(lastCommand.timer);
  };

  return {
    sendCommand,
    handleCommand,
    handleCommandAck,
  };
}
