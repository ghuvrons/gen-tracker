import { getValue, log } from "src/js/utils";
import { notify } from "src/js/framework";
import { INSERT_COMMAND } from "src/store/db/action-types";
import { buildCommand, parseCommand, validateCommand } from "src/js/command";
import config from "src/js/opt/config";

import { useQuasar } from "quasar";
import { computed } from "vue";
import { useStore } from "vuex";
const md5 = require("md5");

export default function ({ publisher, addDevices }) {
  const $q = useQuasar();
  const store = useStore();
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const insertCommand = (v) => store.dispatch(INSERT_COMMAND, v);

  const awaitCommand = computed(() => {
    const { lastCommand } = devDevice.value ?? {};
    return lastCommand && !lastCommand.hasOwnProperty("resCode");
  });

  const checkCommand = (payload) => {
    if (!payload) return notify("No payload");
    if (!devDevice.value) return notify("No device");

    const { vin, online, ready } = devDevice.value;
    if (awaitCommand.value) return notify("Command busy");
    // if (!online) return notify("Device offline");
    if (!ready) return notify("Device busy");

    const cmd = validateCommand(payload.toUpperCase());
    if (!cmd) return;
    if (typeof cmd === "string") return notify(cmd);

    return { vin, cmd };
  };
  const publishCommand = (cmd, vin) => {
    const { hexCmd, ...command } = buildCommand(cmd, vin);
    addDevices([{ vin, cmdStatus: "Sending..." }]);

    const binCmd = Buffer.from(hexCmd, "hex");
    publisher(vin, binCmd);

    insertCommand({
      ...command,
      timer: setInterval(() => {
        addDevices([{ vin, cmdStatus: "Retrying..." }]);
        publisher(vin, binCmd);
      }, config.command.retryInterval),
    });
  };
  const sendCommand = (payload) => {
    const { vin, cmd } = checkCommand(payload) ?? {};

    if (!cmd) return;

    const keypass = $q.sessionStorage.getItem("keypass");
    if (keypass == config.command.keypass) {
      return publishCommand(cmd, vin);
    }

    $q.dialog({
      dark: $q.dark.isActive,
      title: "Security",
      message: "What is the magic word?",
      prompt: {
        model: "",
        type: "text", // optional
      },
      cancel: true,
      persistent: true,
    }).onOk((keypass) => {
      if (md5(keypass) == config.command.keypass) {
        $q.sessionStorage.set("keypass", config.command.keypass);
        publishCommand(cmd, vin);
        notify("Password accepted.", "positive");
      } else notify("Wrong password!", "negative");
    });
  };
  const handleCommand = (data, topic) => {
    const vin = parseInt(topic.split("/")[1]);
    const hex = data.toString("hex").toUpperCase();

    if (hex) log(awaitCommand.value ? "warn" : "error", `COMMAND ${hex}`);

    const ready = !hex;
    if (ready) notify(`Device ready`, "info");

    log("warn", `${ready ? "READY" : "BUSY"} ${vin}`);
    addDevices([{ vin, ready }]);

    if (!awaitCommand.value) return;

    const { lastCommand } = devDevice.value;
    const command = parseCommand(hex);

    if (getValue(command, "sendDatetime") != lastCommand.sendDatetime) return;
    if (!ready) addDevices([{ vin, cmdStatus: "Waitting..." }]);
    else clearInterval(lastCommand.timer);
  };
  const handleAck = (hex) => {
    log(awaitCommand.value ? "warn" : "error", `ACK ${hex}`);

    if (!awaitCommand.value) return;
    const { vin, lastCommand } = devDevice.value;
    addDevices([{ vin, cmdStatus: "Processing..." }]);
    clearInterval(lastCommand.timer);
  };

  return {
    sendCommand,
    awaitCommand,
    handleCommand,
    handleAck,
  };
}
