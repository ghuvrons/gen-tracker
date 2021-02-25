<template>
  <div :style="contentStyle">
    <div class="row q-gutter-xs">
      <div class="col-auto">
        <q-btn
          icon="delete"
          label="Reset DB"
          :disable="devices.length == 0"
          @click="clearStore()"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="alarm_on"
          label="Calibrate"
          :disable="devReports.length == 0"
          @click="calibrate()"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="stop"
          label="Ignore command"
          :disable="!command.exec"
          @click="ignoreCommand()"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="cloud_download"
          label="Export CSV"
          :disable="reports.length == 0"
          @click.native="exportCSV(reports)"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="cloud_download"
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
          auto-upload
        />
      </div>
    </div>
    <div class="row q-gutter-xs q-mt-xs">
      <div class="col-auto">
        <q-toggle v-model="notificationState" label="Notification" />
      </div>
    </div>
  </div>
</template>

<script>
import { SET_NOTIFICATION } from "src/store/common/mutation-types";
import { CLEAR_DATABASE, ADD_BUFFERS } from "src/store/db/mutation-types";
import { STOP_COMMAND, INSERT_COMMAND } from "src/store/db/action-types";
import { exportCSV, exportJSON, importJSON } from "src/js/exporter";
import { confirm, notify } from "src/js/framework";
import { calibrateTime } from "src/js/utils";
import { frameId } from "src/js/utils";

import { ref, computed } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const {
  useState,
  useGetters,
  useMutations,
  useActions
} = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  props: {
    contentStyle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { devices, command, reports } = useState([
      "devices",
      "command",
      "reports"
    ]);
    const { devDevice, devReports } = useGetters(["devDevice", "devReports"]);
    const {
      [CLEAR_DATABASE]: clearDatabase,
      [ADD_BUFFERS]: addBuffers
    } = useMutations([CLEAR_DATABASE, ADD_BUFFERS]);
    const {
      [STOP_COMMAND]: stopCommand,
      [INSERT_COMMAND]: insertCommand
    } = useActions([STOP_COMMAND, INSERT_COMMAND]);

    const common = createNamespacedHelpers("common");
    const { notification } = common.useState(["notification"]);
    const { [SET_NOTIFICATION]: setNotification } = common.useMutations([
      SET_NOTIFICATION
    ]);

    const uploader = ref(null);

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
    const calibrate = () => {
      if (!devDevice) return;

      let report = devReports.value.find(
        ({ frameID }) => frameId(frameID.val) == "FULL"
      );
      if (!report) return;

      let validTime = calibrateTime(report);
      if (!validTime) return;

      insertCommand({ payload: `REPORT_RTC=${validTime}` });
      notify("Calibrating device time..", "info");
    };
    const importData = ([file]) =>
      importJSON(file).then(hexs => {
        hexs.forEach(hex => addBuffers(hex));
        uploader.value.reset();
      });

    return {
      uploader,

      devices,
      command,
      reports,
      devReports,

      notificationState,

      calibrate,
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
