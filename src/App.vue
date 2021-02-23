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
  TAKE_FINGER_TIME
} from "src/store/db/mutation-types";
import { parseCommand, buildCommand, extractCommand } from "src/js/command";
import { validateFrame } from "src/js/frame";
import { isString, dilation, frameId } from "src/js/utils";
import { calibrateTime } from "src/js/utils";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  STOP_COMMAND,
  INSERT_COMMAND,
  INSERT_REPORTS,
  INSERT_RESPONSES
} from "src/store/db/action-types";
import { parseReport } from "src/js/report";
import { parseResponse, parseResCode } from "src/js/response";
import config from "src/js/opt/config";
import { notify } from "src/js/framework";
import { get } from "lodash";
import moment from "moment";
import { readEvent } from "src/js/event";

export default {
  name: "App",
  data() {
    return {
      notifier: null,
      cmdTick: null,
      cmdExecuting: null
    };
  },
  computed: {
    ...mapState("common", ["follow", "calibration", "notification"]),
    ...mapState("db", ["command", "responses", "reports"]),
    ...mapGetters("db", ["devDevice", "devReports", "devEvents"])
  },
  methods: {
    ...mapMutations("db", [
      SET_REPORT,
      ADD_FINGERS,
      REMOVE_FINGERS,
      CLEAR_FINGERS,
      TAKE_FINGER_TIME
    ]),
    ...mapActions("db", [
      INSERT_RESPONSES,
      INSERT_REPORTS,
      INSERT_COMMAND,
      STOP_COMMAND
    ]),
    notifyResponse({ resCode }) {
      let res = parseResCode(resCode);
      let ok = res.title == "OK";

      let type = ok ? "positive" : "negative";
      let msg = ok ? "Command sent." : `Command is ${res.title}`;

      notify(msg, type);
    },

    starWaitting(exec) {
      let { timeout } = config.command;
      if (exec.timeout > timeout) timeout = exec.timeout;

      this.cmdExecuting = exec;
      this.cmdTick = moment();
      this.timers.cmdTimeout.time = timeout * 1000;
      this.$timer.start("cmdTimeout");
      this.notifier = this.$q.notify({
        message: "Sending command....",
        timeout: 0
      });
    },
    stopWaitting() {
      if (this.notifier) this.notifier();
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
      if (!this.devDevice) return;

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

      if (dilation(report.logDatetime.val, "years") > 1) {
        if (this.calibration)
          if (dilation(report.sendDatetime.val, "years") > 1)
            this.calibrate(report);
        return console.error(`^REPORT (EXPIRED)`);
      }

      if (
        this.reports.some(
          ({ logDatetime }) => logDatetime.val == report.logDatetime.val
        )
      )
        return console.error(`^REPORT (DUPLICATE)`);

      this.INSERT_REPORTS(report);
      return report;
    },
    validFrame(bin) {
      let hex = bin.toString("hex").toUpperCase();
      let valid = validateFrame(hex);

      if (!valid) return console.error(`CORRUPT ${hex}`);
      return hex;
    }
  },
  timers: {
    cmdTimeout: { time: 0 }
  },
  mounted() {
    this.$mqtt.subscribe("VCU/+/RPT", { qos: 1 });
    this.$mqtt.subscribe("VCU/+/RSP", { qos: 2 });
  },
  mqtt: {
    "VCU/+/RSP": function(data, topic) {
      let hex = this.validFrame(data);
      if (!hex) return;

      if (!this.cmdExecuting) return console.error(`RESPONSE ${hex}`);
      console.warn(`RESPONSE ${hex}`);

      let response = this.handleResponseFrame(hex);
      if (!response) return;
    },
    "VCU/+/RPT": function(data, topic) {
      let hex = this.validFrame(data);
      if (!hex) return;
      console.log(`REPORT ${hex}`);

      let report = this.handleReportFrame(hex);
      if (!report) return;

      if (get(this.cmdExecuting, "timeout") > 60)
        this.handleCommandLost(report);
    }
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

          this.$mqtt.publish(`VCU/${unitID}/CMD`, binData, { qos: 2 });
          console.log(`COMMAND ${hexCmd}`);

          this.starWaitting({
            ...cmd,
            unitID,
            payload,
            hexCmd
          });
        } else {
          this.stopWaitting();
        }
      }
    },
    "responses.0": function(response) {
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
          ids.forEach(fingerID => this.ADD_FINGERS({ unitID, fingerID }));
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

        if (this.notification && oldDevReport) {
          let curEvents = readEvent(devReport);
          let oldEvents = readEvent(oldDevReport);
          let newEvents = curEvents.filter(evt => !oldEvents.includes(evt));
          newEvents.forEach(evt => {
            this.$notification.show(
              evt,
              { body: devReport.logDatetime.out },
              {}
            );
          });
        }
      }
    }
  }
};
</script>

<style>
</style>
