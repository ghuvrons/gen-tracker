<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { validateFrame } from "components/js/frame";
import { isString, dilation } from "components/js/utils";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  SET_LOADING,
  SET_COMMAND,
  CLEAR_COMMAND,
} from "src/store/db/mutation-types";
import { INSERT_REPORTS, INSERT_RESPONSES } from "src/store/db/action-types";
import { parseReport } from "components/js/report";
import { parseResponse, parseResCode } from "components/js/response";
import { parseCommand, buildCommand } from "components/js/command";
import { QSpinnerGears } from "quasar";
import { cloneDeep } from "lodash";
import { devReports } from "src/store/db/getter-types";
import moment from "moment";

export default {
  name: "App",
  created() {
    this.$root.$on("executeCommand", this.executeCommand);
    this.$root.$on("ignoreCommand", this.ignoreCommand);
    this.$root.$on("importData", this.importData);
  },
  destroyed() {
    this.$root.$off("executeCommand", this.executeCommand);
    this.$root.$off("ignoreCommand", this.ignoreCommand);
    this.$root.$off("importData", this.importData);
  },
  data() {
    return {
      dialog: null,
      notification: null,
      importBuffer: [],
      importTotal: 0,
      commandTime: null,
    };
  },
  computed: {
    ...mapState("db", ["command", "responses", "reports", "device"]),
    ...mapGetters("db", [devReports]),
  },
  methods: {
    ...mapMutations("db", [SET_LOADING, SET_COMMAND, CLEAR_COMMAND]),
    ...mapActions("db", [INSERT_RESPONSES, INSERT_REPORTS]),
    importData(reports) {
      this.importTotal = reports.length;
      this.importBuffer = cloneDeep(reports);

      this.$timer.start("importer");
      this.dialog = this.$q.dialog({
        title: "Importing...",
        dark: this.$q.dark.isActive,
        message: "0%",
        persistent: true,
        ok: false,
        progress: {
          spinner: QSpinnerGears,
          color: "primary",
        },
      });
    },
    importer() {
      let len = this.importBuffer.length;
      if (len > 0) {
        let percentage = (len * 100) / this.importTotal;
        this.dialog.update({ message: `${percentage.toFixed(2)}%` });
        this.handleReportFrame(this.importBuffer.pop());
      } else {
        if (this.timers.importer.isRunning) this.$timer.stop("importer");
        if (this.dialog) this.dialog.hide();
      }
    },

    notifyError(message) {
      this.$q.notify({ type: "negative", message });
    },
    executeCommand(payload) {
      if (!this.device) return this.notifyError("No device.");
      if (this.command) return this.notifyError("Command busy.");

      let cmd = parseCommand(payload);
      if (isString(cmd)) return this.notifyError(cmd);

      let { unitID } = this.device;
      let hexCmd = buildCommand(cmd, unitID);
      let binData = Buffer.from(hexCmd, "hex");

      this.SET_COMMAND({
        ...cmd,
        unitID,
        payload,
        hexCmd,
      });

      this.$mqtt.publish(`VCU/${unitID}/CMD`, binData);
      console.log(`COMMAND ${hexCmd}`);

      this.starWaitting();
      this.commandTime = moment();
    },

    starWaitting() {
      let timeout = this.command.timeout || this.$config.command.timeout;

      this.SET_LOADING(true);
      this.timers.cmdTimeout.time = timeout * 1000;
      this.$timer.start("cmdTimeout");
      this.notification = this.$q.notify({
        message: "Sending command....",
        timeout: 0,
      });
    },
    stopWaitting(type, message) {
      this.SET_LOADING(false);
      this.CLEAR_COMMAND();
      this.$q.notify({ type, message });

      if (this.notification) this.notification();
      if (this.timers.cmdTimeout.isRunning) this.$timer.stop("cmdTimeout");
    },
    cmdTimeout() {
      let response = parseResponse(this.command, null);
      this.INSERT_RESPONSES(response);
    },
    ignoreCommand() {
      this.stopWaitting("warning", "Command ignored.");
    },
    handleCommandLost(report) {
      let { sendDatetime, unitID } = report;

      if (this.command.unitID != unitID.val) return;

      if (dilation(sendDatetime.val, "seconds", this.commandTime) < 10) return;

      this.stopWaitting("negative", "Command is lost");
      this.cmdTimeout();
    },

    validFrame(bin) {
      let hex = bin.toString("hex").toUpperCase();
      let valid = validateFrame(hex);

      if (!valid) return console.error(`CORRUPT ${hex}`);
      return hex;
    },
    handleResponseFrame(hex) {
      let response = parseResponse(this.command, hex);
      if (!response) return;
      if (response.unitID !== this.command.unitID) return;

      this.INSERT_RESPONSES(response);
      return response;
    },
    handleReportFrame(hex) {
      let report = parseReport(hex);

      if (Math.abs(dilation(report.logDatetime.val, "years")) > 1)
        return console.warn(`^REPORT (EXPIRED)`);

      if (
        this.reports.some(
          ({ logDatetime }) => logDatetime.val == report.logDatetime.val
        )
      )
        return console.warn(`^REPORT (DUPLICATE)`);

      this.INSERT_REPORTS(report);
      return report;
    },
  },
  timers: {
    cmdTimeout: { time: 0 },
    importer: { time: 10, repeat: true },
  },
  mounted() {
    this.$mqtt.subscribe("VCU/#");
  },
  mqtt: {
    "VCU/+/RSP": function (data, topic) {
      if (!this.command) return;

      let hex = this.validFrame(data);
      if (!hex) return;
      console.log(`RESPONSE ${hex}`);

      let response = this.handleResponseFrame(hex);
      if (!response) return;
    },
    "VCU/+/RPT": function (data, topic) {
      let hex = this.validFrame(data);
      if (!hex) return;
      console.log(`REPORT ${hex}`);

      let report = this.handleReportFrame(hex);
      if (!report) return;

      if (this.command && this.command.timeout > 60)
        this.handleCommandLost(report);
    },
  },
  watch: {
    responses: function (responses) {
      if (responses.length == 0) return;

      let { resCode } = responses[0];
      let res = parseResCode(resCode);
      let ok = res.title == "OK";

      let type = ok ? "positive" : "negative";
      let message = ok ? "Command sent." : `Command is ${res.title}`;

      this.stopWaitting(type, message);
    },
  },
};
</script>

<style>
</style>
