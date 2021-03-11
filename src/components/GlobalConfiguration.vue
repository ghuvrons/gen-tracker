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
      <div class="col-auto" v-if="$q.fullscreen.isCapable">
        <q-btn
          @click="$q.fullscreen.toggle()"
          :label="$q.fullscreen.isActive ? 'Full OFF' : 'Full ON'"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
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
        <q-btn icon="stop" label="Commandable" @click="ignoreResponse()" />
      </div>
      <div class="col-auto">
        <q-btn-dropdown icon="cloud_download" label="Export">
          <q-list>
            <q-item
              :clickable="reports.length > 0"
              @click="exportCSV(reports)"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>CSV</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              :clickable="reports.length > 0"
              @click="exportJSON(reports)"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>JSON</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
import { exportCSV, exportJSON, importJSON } from "src/js/exporter";
import { confirm, notify } from "src/js/framework";
import { calibrateTime } from "src/js/utils";
import { frameId } from "src/js/utils";

import { SET_NOTIFICATION } from "src/store/common/mutation-types";
import { CLEAR_DATABASE } from "src/store/db/mutation-types";
import { INSERT_BUFFERS } from "src/store/db/action-types";

import { ref, computed, watch, inject, defineComponent } from "vue";
import { createNamespacedHelpers } from "vuex";
const {
  useState,
  useGetters,
  useMutations,
  useActions
} = createNamespacedHelpers("db");

export default defineComponent({
  // name: 'ComponentName',
  props: {
    contentStyle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const sendCommand = inject("sendCommand");
    const ignoreResponse = inject("ignoreResponse");

    const { buffers, devices, command, reports } = useState([
      "buffers",
      "devices",
      "command",
      "reports"
    ]);
    const { devDevice, devReports } = useGetters(["devDevice", "devReports"]);
    const { [CLEAR_DATABASE]: clearDatabase } = useMutations([CLEAR_DATABASE]);
    const { [INSERT_BUFFERS]: insertBuffers } = useActions([INSERT_BUFFERS]);

    const common = createNamespacedHelpers("common");
    const { notification } = common.useState(["notification"]);
    const { [SET_NOTIFICATION]: setNotification } = common.useMutations([
      SET_NOTIFICATION
    ]);

    const uploader = ref(null);

    const notificationState = computed({
      get: () => notification.value,
      set: (v) => setNotification(v)
    });

    const clearStore = () =>
      confirm(`Are you sure to remove all data?`).onOk(() => clearDatabase());
    const calibrate = () => {
      if (!devDevice) return;

      let report = devReports.value.find(
        ({ frameID }) => frameId(frameID.val) == "FULL"
      );
      if (!report) return;

      let validTime = calibrateTime(report);
      if (!validTime) return;

      sendCommand(`REPORT_RTC=${validTime}`);
      notify("Calibrating device time..", "info");
    };
    const importData = ([file]) => {
      importJSON(file).then((hexs) => insertBuffers(hexs));
    };

    watch(
      () => buffers.value.length,
      (len) => len == 0 && uploader.value.reset()
    );

    return {
      uploader,

      devices,
      command,
      reports,
      devReports,

      notificationState,

      calibrate,
      clearStore,
      ignoreResponse,
      importData,
      exportJSON,
      exportCSV
    };
  }
});
</script>

<style></style>
