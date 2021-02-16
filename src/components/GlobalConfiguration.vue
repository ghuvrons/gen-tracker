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
          @click.native="exportCSV()"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="cloud_download"
          color="purple"
          label="Export JSON"
          :disable="reports.length == 0"
          @click.native="exportJSON()"
        />
      </div>
    </div>
    <div class="row q-gutter-xs q-mt-xs">
      <div class="col-auto">
        <q-uploader
          ref="importer"
          :factory="importJSON"
          accept=".json"
          label="Import JSON"
          @finishImport="finishImport"
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
import { CLEAR_DATABASE } from "src/store/db/mutation-types";
import { STOP_COMMAND } from "src/store/db/action-types";
import {
  SET_CALIBRATION,
  SET_NOTIFICATION,
} from "src/store/common/mutation-types";
import { mapState, mapMutations } from "vuex";
import { exportCSV, exportJSON, importJSON } from "components/js/exporter";
import { confirm, notify } from "components/js/framework";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  props: {
    contentStyle: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState("common", ["calibration", "notification"]),
    ...mapState("db", ["devices", "command", "reports"]),
    calibrationState: {
      get() {
        return this.calibration;
      },
      set(value) {
        this.SET_CALIBRATION(value);
      },
    },
    notificationState: {
      get() {
        return this.notification;
      },
      set(value) {
        this.SET_NOTIFICATION(value);
      },
    },
  },
  methods: {
    ...mapMutations("common", [SET_CALIBRATION, SET_NOTIFICATION]),
    ...mapMutations("db", [CLEAR_DATABASE, STOP_COMMAND]),
    finishImport() {
      this.$refs.importer.reset();
    },
    exportJSON() {
      exportJSON(this.reports);
    },
    exportCSV() {
      exportCSV(this.reports);
    },
    importJSON(files) {
      importJSON(files[0]).then((res) => this.$root.$emit("importData", res));
    },
    clearStore() {
      confirm(`Are you sure to remove all data?`).onOk(() =>
        this.CLEAR_DATABASE()
      );
    },
    ignoreCommand() {
      notify("Command ignored.", "warning");
      this.STOP_COMMAND();
    },
  },
};
</script>

<style></style>
