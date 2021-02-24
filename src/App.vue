<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import {
  SET_REPORT,
  ADD_FINGERS,
  REMOVE_FINGERS,
  CLEAR_FINGERS,
  TAKE_DEV_FINGER
} from "src/store/db/mutation-types";
import { STOP_COMMAND, INSERT_DEV_STATUS } from "src/store/db/action-types";
import { parseCommand, buildCommand, extractCommand } from "src/js/command";
import { validateFrame } from "src/js/frame";
import { isString } from "src/js/utils";
import { parseResCode } from "src/js/response";
import { notify } from "src/js/framework";
import { readEvent } from "src/js/event";
import useCommandProcessor from "src/composables/useCommandProcessor";
import useBufferProcessor from "src/composables/useBufferProcessor";

import { get } from "lodash";
import { watch, onMounted } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default {
  // name: "App",
  setup(props, { root }) {
    const db = createNamespacedHelpers("db");
    const { command, responses } = db.useState(["command", "responses"]);
    const { devDevice, devReports } = db.useGetters([
      "devDevice",
      "devReports"
    ]);
    const {
      [SET_REPORT]: setReport,
      [ADD_FINGERS]: addFingers,
      [REMOVE_FINGERS]: removeFingers,
      [CLEAR_FINGERS]: clearFingers,
      [TAKE_DEV_FINGER]: takeDevFinger
    } = db.useMutations([
      SET_REPORT,
      ADD_FINGERS,
      REMOVE_FINGERS,
      CLEAR_FINGERS,
      TAKE_DEV_FINGER
    ]);
    const {
      [INSERT_DEV_STATUS]: insertDevStatus,
      [STOP_COMMAND]: stopCommand
    } = db.useActions([INSERT_DEV_STATUS, STOP_COMMAND]);

    const common = createNamespacedHelpers("common");
    const { follow, notification } = common.useState([
      "follow",
      "notification"
    ]);

    const {
      executor,
      starWaitting,
      stopWaitting,
      handleResponse
    } = useCommandProcessor();

    const { addBuffers } = useBufferProcessor();

    onMounted(() => {
      root.$mqtt.subscribe("VCU/+/RPT", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/RSP", { qos: 1 });
      root.$mqtt.subscribe("VCU/+/STS", { qos: 1 });
    });

    watch(
      () => command.value.exec,
      exec => {
        if (!exec) return stopWaitting();
        if (!devDevice.value) return notify("No device.");
        if (executor.value) return notify("Command busy.");

        let { payload } = command.value;
        let cmd = parseCommand(payload);
        if (isString(cmd)) {
          stopCommand();
          return notify(cmd);
        }

        let { unitID } = devDevice.value;
        let hexCmd = buildCommand(cmd, unitID);
        let binData = Buffer.from(hexCmd, "hex");

        root.$mqtt.publish(`VCU/${unitID}/CMD`, binData, { qos: 2 });
        console.log(`COMMAND ${hexCmd}`);

        starWaitting({
          ...cmd,
          unitID,
          payload,
          hexCmd
        });
      },
      { lazy: false }
    );

    watch(
      () => responses.value[0],
      response => {
        if (!response) return;

        let { payload, unitID, message, resCode } = response;
        let res = parseResCode(resCode);
        let ok = res.title == "OK";

        if (!ok) return;

        // DRIVER LOGIC
        let { prop, value } = extractCommand(payload);
        if (prop == "FINGER_FETCH") {
          takeDevFinger(unitID);
          if (message.length > 0)
            message
              .split(",")
              .forEach(fingerID => addFingers({ unitID, fingerID }));
        } else if (prop == "FINGER_ADD")
          addFingers({ unitID, fingerID: message });
        else if (prop == "FINGER_DEL")
          removeFingers({ unitID, fingerID: value });
        else if (prop == "FINGER_RST") clearFingers({ unitID });
      }
    );

    watch(
      () => devReports.value[0],
      (devReport, oldDevReport) => {
        if (!devReport) return setReport(null);

        if (
          devReport.unitID.val != get(oldDevReport, "unitID.val") ||
          follow.value
        )
          setReport(devReport);

        if (notification.value && oldDevReport) {
          let curEvents = readEvent(devReport);
          let oldEvents = readEvent(oldDevReport);
          let newEvents = curEvents.filter(evt => !oldEvents.includes(evt));
          newEvents.forEach(evt =>
            root.$notification.show(
              evt,
              { body: devReport.logDatetime.out },
              {}
            )
          );
        }
      },
      { lazy: false }
    );

    return {
      executor,

      addBuffers,
      handleResponse,
      insertDevStatus
    };
  },
  mqtt: {
    "VCU/+/RSP": function(data, topic) {
      let hex = data.toString("hex").toUpperCase();
      if (!validateFrame(hex)) return console.error(`CORRUPT ${hex}`);

      if (!this.executor) return console.error(`RESPONSE ${hex}`);
      console.warn(`RESPONSE ${hex}`);
      this.handleResponse(hex);
    },
    "VCU/+/RPT": function(data, topic) {
      let hex = data.toString("hex").toUpperCase();
      if (!validateFrame(hex)) return console.error(`CORRUPT ${hex}`);

      this.addBuffers(hex);
    },
    "VCU/+/STS": function(data, topic) {
      let unitID = parseInt(topic.split("/")[1]);
      let status = parseInt(data);

      console.warn(unitID, status);
      this.insertDevStatus({ unitID, status });
    }
  }
};
</script>

<style>
</style>
