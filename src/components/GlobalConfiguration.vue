<template>
  <div :style="`height: calc(100vh - ${height}vh - 105px)`">
    <div class="row q-gutter-xs">
      <div class="col-auto">
        <q-btn
          icon="delete"
          color="negative"
          label="Clear data"
          :disable="units.length == 0"
          @click="clearStore()"
        />
      </div>
      <div class="col-auto">
        <q-btn
          icon="stop"
          color="primary"
          label="Ignore command"
          :disable="!theCommand"
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
          :dark="darker"
          accept=".json"
          label="Import JSON"
          @finish="finish"
        />
      </div>
    </div>
    <div class="row q-gutter-xs q-mt-xs">
      <div class="col-auto">
        <q-toggle v-model="darkState" :dark="darker" label="Dark Mode" />
      </div>
      <div class="col-auto">
        <q-toggle
          v-model="calibrationState"
          :disable="units.length == 0"
          :dark="darker"
          label="Time Calibration"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { devReports } from "../store/db/getter-types";
import { RESET_DATABASE } from "../store/db/action-types";
import { SET_CALIBRATION, SET_DARKER } from "../store/db/mutation-types";
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
      "units",
      "calibration",
      "theCommand",
      "reports",
      "commands",
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
    darkState: {
      get() {
        return this.darker;
      },
      set(value) {
        this.SET_DARKER(value);
      },
    },
  },
  methods: {
    ...mapMutations("db", [SET_CALIBRATION, SET_DARKER]),
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
        if (this.reports.length == 0) {
          let reader = new FileReader();
          reader.onload = (e) => {
            this.$root.$emit("importData", JSON.parse(e.target.result));
            resolve();
          };
          reader.readAsText(files[0]);
        } else {
          this.$q.notify({
            message: "Database should empty",
            type: "negative",
          });
          reject();
        }
      });
    },
    clearStore() {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure to remove all data?`,
          dark: this.darker,
          preventClose: true,
          cancel: true,
        })
        .onOk(() => this.RESET_DATABASE());
    },
  },
  watch: {
    devReports: function (reports) {
      if (reports.length > 0) {
        if (this.calibration) {
          let { frameID, gpsLatitude, gpsLongitude, sendDatetime } = reports[0];
          if (frameID.val === this.$config.frame.id.FULL) {
            let validTime = calibrateTime({
              lat: gpsLatitude.val,
              lng: gpsLongitude.val,
              datetime: sendDatetime.val,
            });
            if (validTime) {
              this.$root.$emit("executeCommand", `REPORT_RTC=${validTime}`);
              this.$q.notify({ message: "Calibrating device time.." });
            }
          }
        }
      }
    },
  },
};
</script>

<style></style>
