<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { validateFrame } from "components/js/frame";
import { getValue, isString } from "components/js/utils";
import { mapState, mapMutations } from "vuex";
import {
  SET_LOADING,
  ADD_UNITS,
  ADD_REPORTS,
  ADD_COMMANDS,
  SET_THE_COMMAND,
  CLEAR_THE_COMMAND,
} from "./store/db/mutation-types";
import { parseReport } from "components/js/report";
import { parseResponse, parseResCode } from "components/js/response";
import { parseCommand } from "components/js/command";
import moment from "moment";
import DummyMixin from "components/mixins/DummyMixin";

export default {
  name: "App",
  // mixins: [DummyMixin],
  created() {
    this.$root.$on("executeCommand", this.executeCommand);
    this.$root.$on("ignoreCommand", this.ignoreCommand);
    this.$root.$on("importReport", this.importReport);
  },
  destroyed() {
    this.$root.$off("executeCommand", this.executeCommand);
    this.$root.$off("ignoreCommand", this.ignoreCommand);
    this.$root.$off("importReport", this.importReport);
  },
  data() {
    return {
      dismiss: null,
    };
  },
  computed: {
    ...mapState("db", ["theCommand", "commands", "reports", "theUnit"]),
  },
  methods: {
    ...mapMutations("db", [
      SET_LOADING,
      ADD_UNITS,
      ADD_REPORTS,
      ADD_COMMANDS,
      SET_THE_COMMAND,
      CLEAR_THE_COMMAND,
    ]),
    importReport(hexs) {
      hexs.forEach((hex) => this.handleFrame(hex));
      this.$q.notify({
        message: "Import data done.",
        type: "positive",
      });
    },

    starWaitting() {
      this.SET_LOADING(true);
      this.dismiss = this.$q.notify({
        message: "Sending command....",
        timeout: 0,
      });
      this.timers.cmdTimeout.time =
        this.theCommand.timeout || this.$config.command.timeoutMS;
      this.$timer.start("cmdTimeout");
    },
    stopWaitting(message, type) {
      this.dismiss();
      this.CLEAR_THE_COMMAND();
      this.SET_LOADING(false);
      if (this.timers.cmdTimeout.isRunning) this.$timer.stop("cmdTimeout");

      this.$q.notify({ message, type });
    },

    cmdTimeout() {
      this.ADD_COMMANDS(parseResponse(this.theCommand, null));
    },
    ignoreCommand() {
      this.stopWaitting("Command ignored.", "warning");
    },

    parseCommand(payload) {
      if (!this.theUnit) return "No device.";
      if (this.theCommand) return "Command busy.";
      return parseCommand(payload);
    },
    executeCommand(payload) {
      let cmd = this.parseCommand(payload);

      if (isString(cmd)) {
        this.$q.notify({ message: cmd, type: "negative" });
        return;
      }

      this.SET_THE_COMMAND({
        ...cmd,
        unitID: this.theUnit,
        payload,
      });
    },
    handleFrame(hex) {
      let header = validateFrame(hex);
      if (!header) {
        console.error(`CORRUPT ${hex}`);
        return;
      }

      let { unitID, frameID } = getValue(header, ["unitID", "frameID"]);

      this.ADD_UNITS(unitID);
      if (frameID === this.$config.frame.id.RESPONSE) {
        console.log(`RESPONSE ${hex}`);
        let response = parseResponse(this.theCommand, hex);
        if (response) this.ADD_COMMANDS(response);
      } else {
        let report = parseReport(hex);

        let difference = moment().diff(moment(report.logDatetime.val, "X"));
        let duration = moment.duration(difference).as("months");

        if (duration > 1) console.warn(`REPORT (EXPIRED) ${hex}`);
        else if (
          this.reports.some(
            ({ logDatetime }) => logDatetime.val == report.logDatetime.val
          )
        )
          console.warn(`REPORT (DUPLICATE) ${hex}`);
        else {
          console.log(`REPORT ${hex}`);
          this.ADD_REPORTS(report);
        }
      }
    },
  },
  timers: {
    cmdTimeout: { time: 0 },
  },
  mounted() {
    this.$mqtt.subscribe("VCU/#");
  },
  mqtt: {
    "VCU/+/RSP": function (data, topic) {
      let hex = data.toString("hex").toUpperCase();
      if (this.theCommand) this.handleFrame(hex);
    },
    "VCU/+/RPT": function (data, topic) {
      let hex = data.toString("hex").toUpperCase();
      this.handleFrame(hex);
    },
  },
  watch: {
    commands: function (commands) {
      if (commands.length > 0) {
        let { resCode } = commands[0];
        let res = parseResCode(resCode);
        let ok = res.title == "OK";

        let message = ok ? "Command sent." : `Command is ${res.title}`;
        let type = ok ? "positive" : "negative";

        this.stopWaitting(message, type);
      }
    },
    theCommand: function (cmd) {
      if (cmd) {
        let { unitID, hex } = cmd;
        let binData = Buffer.from(hex, "hex");

        this.starWaitting();
        this.$mqtt.publish(`VCU/${unitID}/CMD`, binData);
        console.log(`COMMAND ${hex}`);
      }
    },
  },
};
</script>

<style>
</style>
