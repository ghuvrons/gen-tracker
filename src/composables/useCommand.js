import { getValue, log } from "src/js/utils";
import { notify } from "src/js/framework";
import { INSERT_COMMAND } from "src/store/db/action-types";
import { buildCommand, parseCommand, validateCommand } from "src/js/command";
import config from "src/data/config";

import { useQuasar } from "quasar";
import { computed } from "vue";
import { useStore } from "vuex";
import { BinToHex } from "src/js/formatter";
const md5 = require("md5");

export default function ({ publish, addDevices }) {
  const $q = useQuasar();
  const store = useStore();
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const insertCommand = (v) => store.dispatch(INSERT_COMMAND, v);

  const awaitCommand = computed(() => {
    const { lastCommand } = devDevice.value ?? {};
    return lastCommand && !lastCommand.hasOwnProperty("resCode");
  });

  const publisher = (vin, data) => {
    publish(`VCU/${vin}/CMD`, data, { qos: 1, retain: true });
    if (!data) {
      publish(`VCU/${vin}/RSP`, data, { qos: 1, retain: true });
    }
  };
  const flushCommand = (vin) => {
    publisher(vin, null);
  };
  const execCommand = (cmd, vin) => {
    const { hexCmd, ...command } = buildCommand(cmd, vin);
    addDevices([{ vin, cmdStatus: "Sending..." }]);

    const binCmd = Buffer.from(hexCmd, "hex");
    publisher(vin, binCmd);

    insertCommand({
      ...command,
      timer: setInterval(() => {
        addDevices([{ vin, cmdStatus: "Retrying..." }]);
        publisher(vin, binCmd);
      }, config.command.retry),
    });
  };
  const checkCommand = (payload) => {
    if (!payload) {
      notify("No payload");
      return;
    }
    if (!devDevice.value) {
      notify("No device");
      return;
    }

    const { vin, online, ready } = devDevice.value;
    if (awaitCommand.value) {
      notify("Command busy");
      return;
    }
    // if (!online) {
    //   notify("Device offline");
    //   return;
    // }
    if (!ready) {
      notify("Device busy");
      return;
    }

    const cmd = validateCommand(payload);
    if (!cmd) return;
    if (typeof cmd === "string") {
      notify(cmd);
      return;
    }
    return { vin, cmd };
  };
  const sendCommand = (payload) => {
    const { vin, cmd } = checkCommand(payload) ?? {};

    if (!cmd) return;

    const keypass = $q.sessionStorage.getItem("keypass");
    if (keypass == config.command.keypass) {
      return execCommand(cmd, vin);
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
        execCommand(cmd, vin);
        notify("Password accepted.", "positive");
      } else notify("Wrong password!", "negative");
    });
  };
  const handleCommand = (data, topic) => {
    const vin = parseInt(topic.split("/")[1]);
    const hex = BinToHex(data);

    if (hex) log(awaitCommand.value ? "info" : "error", `COMMAND ${hex}`);

    const ready = !hex;
    if (ready) notify(`Device ready`, "info");

    if (ready) log("info", `READY ${vin}`);
    else log("warn", `BUSY ${vin}`);

    addDevices([{ vin, ready }]);

    if (!awaitCommand.value) return;

    const { lastCommand } = devDevice.value;
    const command = parseCommand(hex);

    if (getValue(command, "sendDatetime") != lastCommand.sendDatetime) return;
    if (!ready) addDevices([{ vin, cmdStatus: "Waitting..." }]);
    else clearInterval(lastCommand.timer);
  };
  const handleAck = (hex) => {
    log(awaitCommand.value ? "info" : "error", `ACK ${hex}`);

    if (!awaitCommand.value) return;
    const { vin, lastCommand } = devDevice.value;
    addDevices([{ vin, cmdStatus: "Processing..." }]);
    clearInterval(lastCommand.timer);
  };

  return {
    awaitCommand,
    sendCommand,
    flushCommand,
    handleCommand,
    handleAck,
  };
}
