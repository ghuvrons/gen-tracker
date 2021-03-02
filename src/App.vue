<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { validateFrame } from "src/js/frame";
import useFinger from "src/composables/useFinger";
import useResponse from "src/composables/useResponse";
import useCommand from "src/composables/useCommand";
import useBuffer from "src/composables/useBuffer";
import useReport from "src/composables/useReport";
import useEvents from "src/composables/useEvents";
import useDevice from "src/composables/useDevice";

import { onMounted, ref } from "@vue/composition-api";

export default {
  // name: "App",
  setup(props, { root }) {
    const executor = ref(null);

    const validFrame = (data, topic) => {
      let hex = data.toString("hex").toUpperCase();
      if (!validateFrame(hex)) return console.error(`CORRUPT ${hex}`);
      return hex;
    };
    const publisher = ({ unitID, binCmd }) =>
      root.$mqtt.publish(`VCU/${unitID}/CMD`, binCmd, { qos: 2 });

    const { addDevices } = useDevice();
    const { handleFinger } = useFinger({ addDevices });
    const { handleResponse } = useResponse({ executor, handleFinger });
    const { handleLostCommand } = useCommand({
      executor,
      publisher,
      handleResponse
    });

    const { handleEvents } = useEvents();
    const { handleReports } = useReport({ handleEvents, handleLostCommand });
    const { insertBuffers } = useBuffer({ handleReports });

    onMounted(() => {
      root.$mqtt.subscribe("VCU/+/RPT", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/RSP", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/STS", { qos: 1 });
    });

    return {
      validFrame,
      insertBuffers,
      handleResponse,
      addDevices
    };
  },
  mqtt: {
    "VCU/+/RSP": function(data, topic) {
      const hex = this.validFrame(data, topic);
      if (hex) this.handleResponse(hex);
    },
    "VCU/+/RPT": function(data, topic) {
      const hex = this.validFrame(data, topic);
      if (hex) this.insertBuffers([hex]);
    },
    "VCU/+/STS": function(data, topic) {
      let unitID = parseInt(topic.split("/")[1]);
      let status = parseInt(data);

      console.warn(`STATUS ${unitID},${status}`);
      this.addDevices([{ unitID, status }]);
    }
  }
};
</script>

<style>
</style>
