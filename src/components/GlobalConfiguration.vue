<template>
  <div :style="`height: calc(100vh - ${height}vh - 105px)`">
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
          :disable="!command"
          @click="$root.$emit('ignoreCommand')"
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
          @finish="finish"
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
    </div>
  </div>
</template>

<script>
import { devReports } from "src/store/db/getter-types";
import { RESET_DATABASE } from "src/store/db/action-types";
import { SET_CALIBRATION } from "src/store/db/mutation-types";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { exportCSV, exportJSON } from "components/js/exporter";
import { calibrateTime } from "components/js/utils";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  props: {
    height: {
      required: true,
    },
  },
  computed: {
    ...mapState("db", [
      "calibration",
      "devices",
      "command",
      "reports",
      "responses",
    ]),
    ...mapGetters("db", [devReports]),
    calibrationState: {
      get() {
        return this.calibration;
      },
      set(value) {
        this.SET_CALIBRATION(value);
      },
    },
  },
  methods: {
    ...mapMutations("db", [SET_CALIBRATION]),
    ...mapActions("db", [RESET_DATABASE]),
    finish() {
      this.$refs.importer.reset();
    },
    exportJSON() {
      exportJSON(this.reports);
    },
    exportCSV() {
      exportCSV(this.reports);
    },
    importJSON(files) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.$root.$emit("importData", JSON.parse(e.target.result));
          resolve();
        };
        reader.readAsText(files[0]);
      });
    },
    clearStore() {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure to remove all data?`,
          dark: this.$q.dark.isActive,
          preventClose: true,
          cancel: true,
        })
        .onOk(() => this.RESET_DATABASE());
    },
  },
  watch: {
    devReports: function (devReports) {
      if (devReports.length == 0) return;
      if (!this.calibration) return;

      let { frameID, gpsLatitude, gpsLongitude, sendDatetime } = devReports[0];
      if (frameID.val != this.$config.frame.id.FULL) return;

      let validTime = calibrateTime({
        lat: gpsLatitude.val,
        lng: gpsLongitude.val,
        datetime: sendDatetime.val,
      });
      if (!validTime) return;

      this.$root.$emit("executeCommand", `REPORT_RTC=${validTime}`);
      this.$q.notify({ message: "Calibrating device time.." });
    },
  },
};
</script>

<style></style>
