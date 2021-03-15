import { getValue } from "src/js/utils";
import { notify } from "src/js/framework";
import { INSERT_COMMAND } from "src/store/db/action-types";
import { buildCommand, parseCommand, validateCommand } from "src/js/command";
import config from "src/js/opt/config";

import { computed } from "vue";
import { useStore } from "vuex";

export default function ({ publisher, addDevices }) {
  const store = useStore();
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const insertCommand = (v) => store.dispatch(INSERT_COMMAND, v);

  const awaitCommand = computed(() => {
    const { lastCommand } = devDevice.value ?? {};
    return lastCommand && !lastCommand.hasOwnProperty("resCode");
  });
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
        console.warn(`REPUB COMMAND ${vin}`);
        addDevices([{ vin, cmdStatus: "Retrying..." }]);
        publisher(vin, binCmd);
      }, config.mqtt.retryIntervalMS),
    });
  };
  const handleCommand = (data, topic) => {
    const vin = parseInt(topic.split("/")[1]);
    const hex = data.toString("hex").toUpperCase();

    const commandable = !hex;
    if (commandable) notify(`Device commandbale`, "info");

    console.warn(`${commandable ? "" : "UN"}COMMANDABLE ${vin}`);
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
    console.warn("COMMAND ACK");
    clearInterval(lastCommand.timer);
  };

  return {
    sendCommand,
    awaitCommand,
    handleCommand,
    handleCommandAck,
  };
}
