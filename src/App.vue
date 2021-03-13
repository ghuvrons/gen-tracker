<template>
  <router-view />
</template>

<script>
import useMqtt from "src/composables/useMqtt";
import useFinger from "src/composables/useFinger";
import useResponse from "src/composables/useResponse";
import useCommand from "src/composables/useCommand";
import useBuffer from "src/composables/useBuffer";
import useReport from "src/composables/useReport";
import useEvents from "src/composables/useEvents";
import useDevice from "src/composables/useDevice";

import { onMounted, provide, defineComponent } from "vue";

export default defineComponent({
  // name: "App",
  setup(props) {
    const { subscribe, publish } = useMqtt();

    const publisher = (unitID, data) => {
      publish(`VCU/${unitID}/CMD`, data, { qos: 2, retain: true });
      if (!data) {
        publish(`VCU/${unitID}/RSP`, data, { qos: 1, retain: true });
      }
    };

    const { addDevices, handleStatus, awaitCommand } = useDevice();
    const { handleFinger } = useFinger({ addDevices });
    const { handleResponse, ignoreResponse } = useResponse({
      publisher,
      awaitCommand,
      handleFinger
    });
    const { sendCommand, handleCommand, handleCommandAck } = useCommand({
      publisher,
      awaitCommand,
      ignoreResponse,
      addDevices
    });

    const { handleEvents } = useEvents();
    const { handleReports } = useReport({ handleEvents });
    const { handleBuffer } = useBuffer({ handleReports });

    onMounted(() => {
      subscribe("VCU/+/CMD", { qos: 1 }, handleCommand);
      subscribe("VCU/+/RPT", { qos: 1 }, handleBuffer);
      subscribe("VCU/+/RSP", { qos: 1 }, (data, topic) => {
        const hex = data.toString("hex").toUpperCase();
        if (!hex) return;

        if (parseInt(hex) == 1)
          handleCommandAck();
        else
          handleResponse(hex)
      });
      subscribe("VCU/+/STS", { qos: 1 }, handleStatus);
    });

    provide("awaitCommand", awaitCommand);
    provide("sendCommand", sendCommand);
    provide("ignoreResponse", ignoreResponse);
  },
});
</script>

<style>
</style>
