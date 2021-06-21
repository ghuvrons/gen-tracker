<template>
  <router-view />
</template>

<script>
import { Header } from "src/data/header";
import config from "src/data/config"

import useOfflineDetector from "src/composables/useOfflineDetector";
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
    const { offline } = useOfflineDetector();
    const { brokerOff, subscribe, publish } = useMqtt();

    const { addDevices, handleStatus } = useDevice();
    const { handleFinger } = useFinger({ addDevices });
    const { awaitCommand, sendCommand, flushCommand, handleCommand, handleAck } = useCommand({
      publish,
      addDevices
    });
    const { handleResponse, ignoreResponse } = useResponse({
      awaitCommand,
      flushCommand,
      handleFinger
    });

    const { handleEvents } = useEvents();
    const { handleReports } = useReport({ handleEvents });
    const { handleBuffer } = useBuffer({ handleReports });

    const handleResp = (data, topic) => {
      const hex = data.toString("hex").toUpperCase();
      if (!hex) return;

      const prefixHeader = Header.find(({field}) => field == 'prefix');
      const prefix = prefixHeader.format(hex)

      if (prefix == config.prefix.ack) handleAck(hex);
      else handleResponse(hex)
    }

    onMounted(() => {
      subscribe("VCU/+/CMD", { qos: 1 }, handleCommand);
      subscribe("VCU/+/RPT", { qos: 1 }, handleBuffer);
      subscribe("VCU/+/RSP", { qos: 1 }, handleResp);
      subscribe("VCU/+/STS", { qos: 1 }, handleStatus);
    });

    provide("offline", offline);
    provide("brokerOff", brokerOff);
    provide("sendCommand", sendCommand);
    provide("awaitCommand", awaitCommand);
    provide("ignoreResponse", ignoreResponse);
  },
});
</script>

<style>
</style>
