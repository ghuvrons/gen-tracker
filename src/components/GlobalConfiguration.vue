<template>
  <div :style="contentStyle">
    <div class="row q-gutter-xs">
      <div class="col-auto">
        <q-btn
          icon="delete"
          color="negative"
          label="Clear data"
          :disable="devices.length == 0"
          @click="clearStore()"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="stop"
          color="primary"
          label="Ignore command"
          :disable="!command.exec"
          @click="ignoreCommand()"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="cloud_download"
          color="green"
          label="Export CSV"
          :disable="reports.length == 0"
          @click.native="exportCSV(reports)"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="cloud_download"
          color="purple"
          label="Export JSON"
          :disable="reports.length == 0"
          @click.native="exportJSON(reports)"
        />
      </div>
    </div>
    <div class="row q-gutter-xs q-mt-xs">
      <div class="col-auto">
        <q-uploader
          ref="uploader"
          :factory="importData"
          accept=".json"
          label="Import JSON"
        />
      </div>
    </div>
    <div class="row q-gutter-xs q-mt-xs">
      <div class="col-auto">
        <q-toggle
          v-model="calibrationState"
          :disable="devices.length == 0"
          label="Time Calibration"
        />
      </div>
      <div class="col-auto">
        <q-toggle v-model="notificationState" label="Notification" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  SET_CALIBRATION,
  SET_NOTIFICATION
} from "src/store/common/mutation-types";
import { CLEAR_DATABASE, ADD_BUFFERS } from "src/store/db/mutation-types";
import { STOP_COMMAND } from "src/store/db/action-types";
import { exportCSV, exportJSON, importJSON } from "src/js/exporter";
import { confirm, notify } from "src/js/framework";

import { ref, computed } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default {
  // name: 'ComponentName',
  props: {
    contentStyle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const db = createNamespacedHelpers("db");
    const { devices, command, reports } = db.useState([
      "devices",
      "command",
      "reports"
    ]);
    const {
      [CLEAR_DATABASE]: clearDatabase,
      [STOP_COMMAND]: stopCommand,
      [ADD_BUFFERS]: addBuffers
    } = db.useMutations([CLEAR_DATABASE, STOP_COMMAND, ADD_BUFFERS]);

    const common = createNamespacedHelpers("common");
    const { calibration, notification } = common.useState([
      "calibration",
      "notification"
    ]);
    const {
      [SET_CALIBRATION]: setCalibration,
      [SET_NOTIFICATION]: setNotification
    } = common.useMutations([SET_CALIBRATION, SET_NOTIFICATION]);

    const uploader = ref(null);

    const calibrationState = computed({
      get: () => calibration.value,
      set: v => setCalibration(v)
    });
    const notificationState = computed({
      get: () => notification.value,
      set: v => setNotification(v)
    });

    const clearStore = () =>
      confirm(`Are you sure to remove all data?`).onOk(() => clearDatabase());
    const ignoreCommand = () => {
      notify("Command ignored.", "warning");
      stopCommand();
    };
    const importData = ([file]) =>
      importJSON(file).then(hexs => {
        hexs.forEach(hex => addBuffers(hex));
        if (uploader.value) uploader.value.reset();
      });

    return {
      uploader,

      devices,
      command,
      reports,

      calibrationState,
      notificationState,

      clearStore,
      ignoreCommand,
      importData,
      exportJSON,
      exportCSV
    };
  }
};
</script>

<style></style>
