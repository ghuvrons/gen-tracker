<template>
  <div id="q-app">
    <router-view />
  </div>
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

import { onMounted, provide } from "@vue/composition-api";

export default {
  // name: "App",
  setup(props, { root }) {
    const publisher = (unitID, data) => {
      // if (data)
      //  root.$mqtt.publish(`VCU/${unitID}/RSP`, null, { qos: 1, retain: true }, (err) => err && notify(err) );

      root.$mqtt.publish(`VCU/${unitID}/CMD`, data, { qos: 2, retain: true }, (err) => err && notify(err) );

      if (!data)
        root.$mqtt.publish(`VCU/${unitID}/RSP`, null, { qos: 1, retain: true }, (err) => err && notify(err) );
    };

    const { addDevices } = useDevice();
    const { handleFinger } = useFinger({ addDevices });
    const { handleResponse, ignoreResponse } = useResponse({
      publisher,
      handleFinger
    });
    const { sendCommand, handleLostCommand } = useCommand({
      publisher,
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

    provide("ignoreResponse", ignoreResponse);
    provide("sendCommand", sendCommand);

    return {
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

      console.warn(`COMMANDABLE ${unitID}, ${!hex}`);
      this.addDevices([{ unitID, commandable: !hex }]);
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
