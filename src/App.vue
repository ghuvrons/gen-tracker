<template>
  <router-view />
</template>

<script>
import { validateFrame } from "src/js/frame";
import { notify } from "src/js/framework";
import config from "src/js/opt/config";

import useFinger from "src/composables/useFinger";
import useResponse from "src/composables/useResponse";
import useCommand from "src/composables/useCommand";
import useBuffer from "src/composables/useBuffer";
import useReport from "src/composables/useReport";
import useEvents from "src/composables/useEvents";
import useDevice from "src/composables/useDevice";

import { onMounted, provide, computed } from "vue";
import { parseCommand } from "./js/command";
import { getValue } from "./js/utils";

export default {
  // name: "App",
  setup(props, { root }) {
    const publish = (unitID, data, subTopic, qos) => {
      root.$mqtt.publish(
        `VCU/${unitID}/${subTopic}`,
        data,
        { qos, retain: true },
        e => e && notify(e)
      );
    };
    const publisher = (unitID, data) => {
      publish(unitID, data, "CMD", 2);
      if (!data) publish(unitID, data, "RSP", 1);
    };

    const { devDevice, addDevices } = useDevice();
    const awaitCommand = computed(() => {
      const { lastCommand: cmd } = devDevice.value;
      return cmd && !cmd.hasOwnProperty("resCode");
    });

    const { handleFinger } = useFinger({ addDevices });
    const { handleResponse, ignoreResponse } = useResponse({
      publisher,
      awaitCommand,
      handleFinger
    });
    const { sendCommand, handleLostCommand } = useCommand({
      publisher,
      awaitCommand,
      ignoreResponse
    });

    const { handleEvents } = useEvents();
    const { handleReports } = useReport({ handleEvents, handleLostCommand });
    const { insertBuffers } = useBuffer({ handleReports });

    onMounted(() => {
      root.$mqtt.subscribe("VCU/+/CMD", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/RPT", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/RSP", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/STS", { qos: 1 });
    });

    provide("awaitCommand", awaitCommand);
    provide("sendCommand", sendCommand);
    provide("ignoreResponse", ignoreResponse);

    return {
      devDevice,
      awaitCommand,
      validateFrame,
      insertBuffers,
      handleResponse,
      addDevices
    };
  },
  mqtt: {
    "VCU/+/CMD": function(data, topic) {
      const unitID = parseInt(topic.split("/")[1]);
      const hex = data.toString("hex").toUpperCase();
      const commandable = !hex;

      console.warn(`COMMANDABLE ${unitID}, ${commandable}`);
      this.addDevices([{ unitID, commandable }]);

      if (commandable) return notify("Device commandable", "info");
      if (!this.awaitCommand) return;

      const { lastCommand } = this.devDevice;
      const command = parseCommand(hex);
      if (getValue(command, "sendDatetime") == lastCommand.sendDatetime) return;

      clearTimeout(lastCommand.timer);
    },
    "VCU/+/RSP": function(data, topic) {
      const hex = data.toString("hex").toUpperCase();
      if (!hex) return;
      if (!validateFrame(hex, config.prefix.response))
        return console.error(`CORRUPT ${hex}`);
      this.handleResponse(hex);
    },
    "VCU/+/RPT": function(data, topic) {
      const hex = data.toString("hex").toUpperCase();
      if (!hex) return;
      if (!validateFrame(hex, config.prefix.report))
        return console.error(`CORRUPT ${hex}`);
      this.insertBuffers([hex]);
    },
    "VCU/+/STS": function(data, topic) {
      const unitID = parseInt(topic.split("/")[1]);
      const status = parseInt(data);

      console.warn(`STATUS ${unitID},${status}`);
      this.addDevices([{ unitID, status }]);
    }
  }
};
</script>

<style>
</style>
