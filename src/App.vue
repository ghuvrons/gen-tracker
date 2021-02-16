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
  TAKE_FINGER_TIME,
} from "src/store/db/mutation-types";
import {
  parseCommand,
  buildCommand,
  extractCommand,
} from "components/js/command";
import { validateFrame } from "components/js/frame";
import { isString, dilation, frameId } from "components/js/utils";
import { calibrateTime } from "components/js/utils";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  STOP_COMMAND,
  INSERT_COMMAND,
  INSERT_REPORTS,
  INSERT_RESPONSES,
} from "src/store/db/action-types";
import { devDevice, devReports } from "src/store/db/getter-types";
import { parseReport } from "components/js/report";
import { parseResponse, parseResCode } from "components/js/response";
import config from "components/js/opt/config";
import { notify } from "components/js/framework";
import { loader } from "components/js/framework";
import { cloneDeep, get } from "lodash";
import CommonMixin from "components/mixins/CommonMixin";
import moment from "moment";

export default {
  name: "App",
  mixins: [CommonMixin],
  created() {
    this.$root.$on("importData", this.importData);
  },
  destroyed() {
    this.$root.$off("importData", this.importData);
  },
  data() {
    return {
      dialog: null,
      notification: null,
      importBuffer: [],
      importTotal: 0,
      cmdTick: null,
      cmdExecuting: null,
    };
  },
  computed: {
    ...mapState("db", ["command", "responses", "reports"]),
    ...mapState("common", ["follow", "calibration"]),
    ...mapGetters("db", [devDevice, devReports]),
  },
  methods: {
    ...mapMutations("db", [
      SET_REPORT,
      ADD_FINGERS,
      REMOVE_FINGERS,
      CLEAR_FINGERS,
      TAKE_FINGER_TIME,
    ]),
    ...mapActions("db", [
      INSERT_RESPONSES,
      INSERT_REPORTS,
      INSERT_COMMAND,
      STOP_COMMAND,
    ]),
    importData(reports) {
      this.importTotal = reports.length;
      this.importBuffer = cloneDeep(reports);

      this.$timer.start("importer");
      this.dialog = loader("Importing...");
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
    notifyResponse({ resCode }) {
      let res = parseResCode(resCode);
      let ok = res.title == "OK";

      let type = ok ? "positive" : "negative";
      let msg = ok ? "Command sent." : `Command is ${res.title}`;

      notify(msg, type);
    },

    starWaitting(exec) {
      this.cmdExecuting = exec;

      this.cmdTick = moment();
      this.timers.cmdTimeout.time =
        (exec.timeout || config.command.timeout) * 1000;
      this.$timer.start("cmdTimeout");
      this.notification = this.$q.notify({
        message: "Sending command....",
        timeout: 0,
      });
    },
    stopWaitting() {
      if (this.notification) this.notification();
      if (this.timers.cmdTimeout.isRunning) this.$timer.stop("cmdTimeout");
      if (this.cmdExecuting) this.cmdExecuting = null;
    },
    cmdTimeout() {
      let response = parseResponse(this.cmdExecuting, null);

      this.INSERT_RESPONSES(response);
      this.notifyResponse(response);
      this.STOP_COMMAND();
    },
    handleCommandLost(report) {
      let { sendDatetime, unitID } = report;

      if (this.cmdExecuting.unitID != unitID.val) return;
      if (dilation(sendDatetime.val, "seconds", this.cmdTick) < 10) return;

      notify("Command lost.", "warning");
      this.STOP_COMMAND();
    },

    calibrate(report) {
      if (report.frameID.val != frameId("FULL")) return;

      let validTime = calibrateTime(report);
      if (!validTime) return;

      this.INSERT_COMMAND({ payload: `REPORT_RTC=${validTime}` });
      notify("Calibrating device time..", "info");
    },
    handleResponseFrame(hex) {
      let response = parseResponse(this.cmdExecuting, hex);
      if (get(response, "unitID") !== this.cmdExecuting.unitID) return;

      this.INSERT_RESPONSES(response);
      this.notifyResponse(response);
      this.STOP_COMMAND();

      return response;
    },
    handleReportFrame(hex) {
      let report = parseReport(hex);

      if (dilation(report.sendDatetime.val, "minutes") > 2) {
        if (this.calibration) this.calibrate(report);
        return console.warn(`^REPORT (EXPIRED)`);
      }

      if (
        this.reports.some(
          ({ logDatetime }) => logDatetime.val == report.logDatetime.val
        )
      )
        return console.warn(`^REPORT (DUPLICATE)`);

      this.INSERT_REPORTS(report);
      return report;
    },
    validFrame(bin) {
      let hex = bin.toString("hex").toUpperCase();
      let valid = validateFrame(hex);

      if (!valid) return console.error(`CORRUPT ${hex}`);
      return hex;
    },
  },
  timers: {
    cmdTimeout: { time: 0 },
    importer: { time: 100, repeat: true },
  },
  mounted() {
    this.$mqtt.subscribe("VCU/#", { qos: 1 });
  },
  mqtt: {
    "VCU/+/RSP": function (data, topic) {
      if (!this.cmdExecuting) return;

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

      if (get(this.cmdExecuting, "timeout") > 60)
        this.handleCommandLost(report);
    },
  },
  watch: {
    "command.exec": {
      immediate: true,
      handler(exec) {
        if (exec) {
          if (!this.devDevice) return notify("No device.");
          if (this.cmdExecuting) return notify("Command busy.");

          let { payload } = this.command;
          let cmd = parseCommand(payload);
          if (isString(cmd)) {
            this.STOP_COMMAND();
            return notify(cmd);
          }

          let { unitID } = this.devDevice;
          let hexCmd = buildCommand(cmd, unitID);
          let binData = Buffer.from(hexCmd, "hex");

          this.$mqtt.publish(`VCU/${unitID}/CMD`, binData);
          console.log(`COMMAND ${hexCmd}`);

          this.starWaitting({
            ...cmd,
            unitID,
            payload,
            hexCmd,
          });
        } else {
          this.stopWaitting();
        }
      },
    },
    "responses.0": function (response) {
      if (!response) return;

      let { payload, unitID, message, resCode } = response;
      let res = parseResCode(resCode);
      let ok = res.title == "OK";

      if (!ok) return;

      // DRIVER LOGIC
      let { prop, value } = extractCommand(payload);
      if (prop == "FINGER_FETCH") {
        this.TAKE_FINGER_TIME(unitID);
        if (message.length > 0) {
          let ids = message.split(",");
          ids.forEach((fingerID) => this.ADD_FINGERS({ unitID, fingerID }));
        }
      } else if (prop == "FINGER_ADD")
        this.ADD_FINGERS({ unitID, fingerID: message });
      else if (prop == "FINGER_DEL")
        this.REMOVE_FINGERS({ unitID, fingerID: value });
      else if (prop == "FINGER_RST") this.CLEAR_FINGERS({ unitID });
    },
    "devReports.0": {
      immediate: true,
      handler(devReport, oldDevReport) {
        if (!devReport) return this.SET_REPORT(null);

        if (
          devReport.unitID.val != get(oldDevReport, "unitID.val") ||
          this.follow
        )
          this.SET_REPORT(devReport);
      },
    },
  },
};
</script>

<style>
</style>
