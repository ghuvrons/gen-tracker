<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { INSERT_DEV_STATUS } from "src/store/db/action-types";
import { validateFrame } from "src/js/frame";
import useFinger from "src/composables/useFinger";
import useResponse from "src/composables/useResponse";
import useCommand from "src/composables/useCommand";
import useBuffer from "src/composables/useBuffer";
import useReport from "src/composables/useReport";
import useEvents from "src/composables/useEvents";
import useDevice from "src/composables/useDevice";

import { onMounted, ref } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useActions } = createNamespacedHelpers("db");

export default {
  // name: "App",
  setup(props, { root }) {
    const { [INSERT_DEV_STATUS]: insertDevStatus } = useActions([
      INSERT_DEV_STATUS
    ]);

    const executor = ref(null);

    const validFrame = (data, topic) => {
      let hex = data.toString("hex").toUpperCase();
      if (!validateFrame(hex)) return console.error(`CORRUPT ${hex}`);
      return hex;
    };
    const publisher = ({ unitID, binCmd }) =>
      root.$mqtt.publish(`VCU/${unitID}/CMD`, binCmd, { qos: 2 });

    const { handleFinger } = useFinger();
    const { handleResponse } = useResponse(executor, handleFinger);
    useCommand(executor, publisher, handleResponse);
    useDevice();

    const { handleEvents } = useEvents();
    const { handleReport } = useReport(handleEvents);
    const { addBuffers } = useBuffer(handleReport);

    onMounted(() => {
      root.$mqtt.subscribe("VCU/+/RPT", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/RSP", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/STS", { qos: 1 });
    });

    return {
      validFrame,
      addBuffers,
      handleResponse,
      insertDevStatus
    };
  },
  mqtt: {
    "VCU/+/RSP": function(data, topic) {
      const hex = this.validFrame(data, topic);
      if (hex) this.handleResponse(hex);
    },
    "VCU/+/RPT": function(data, topic) {
      const hex = this.validFrame(data, topic);
      if (hex) this.addBuffers(hex);
    },
    "VCU/+/STS": function(data, topic) {
      let unitID = parseInt(topic.split("/")[1]);
      let status = parseInt(data);

      console.warn(`STATUS ${unitID},${status}`);
      this.insertDevStatus({ unitID, status });
    }
  }
};
</script>

<style>
</style>
