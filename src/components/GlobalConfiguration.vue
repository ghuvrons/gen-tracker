<template>
  <div class="row justify-between items-center" style="height:150px">
    <div class="col-auto">
      <q-btn
        class="q-ma-xs"
        icon="delete"
        color="negative"
        label="Clear all data"
        :disable="!units.length"
        @click="clearStore()"
      />
    </div>
    <div class="col-auto">
      <q-btn
        class="q-ma-xs"
        icon="add"
        color="positive"
        label="Generate fake unit"
        @click="generateFaker()"
      />
    </div>
    <div class="col-auto">
      <q-toggle
        v-model="timeCalibrationState"
        label="Time Calibration"
        class="q-ma-xs"
      />
    </div>
  </div>
</template>

<script>
import faker from "faker";
import {
  generateUnits,
  generateReports,
  generateResponses,
  generateFingers
} from "components/js/faker";
import { mapState } from "vuex";

export default {
  // name: 'ComponentName',
  computed: {
    ...mapState("database", ["units"]),
    timeCalibrationState: {
      get() {
        return this.$store.state.database.settings.timeCalibration;
      },
      set(value) {
        this.$store.commit("database/TOGGLE_TIME_CALIBRATION");
      }
    }
  },
  methods: {
    generateFaker() {
      let excludes = this.units.map(el => el.unitID);
      // units
      let units = generateUnits(1, excludes);
      // add sub-data for each unit
      units.forEach((unit, i) => {
        // units
        this.$store.commit("database/ADD_UNITS", {
          ...unit,
          fake: true
        });
        // reports
        let reports = generateReports(faker.random.number(100), unit.unitID);
        reports.forEach(report => {
          this.$store.commit("database/ADD_REPORTS", report);
        });
        // responses
        let responses = generateResponses(faker.random.number(50), unit.unitID);
        responses.forEach(response => {
          this.$store.commit("database/ADD_RESPONSES", response);
        });
        // fingers
        let fingers = generateFingers(faker.random.number(5), unit.unitID);
        fingers.forEach(finger => {
          this.$store.commit("database/ADD_FINGERS", finger);
        });
      });

      // get unitIDs
      let unitIDs = units.map(el => el.unitID).toString();
      // show done message
      this.$q.notify({
        message: `New unit *${unitIDs}* with sample data succesfully generated`
      });
    },
    clearStore() {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure to remove all data?`,
          preventClose: true,
          cancel: true
        })
        .then(() => {
          // clear all the store
          this.$store.dispatch("database/RESET_DATABASE");
          // reset command input
          this.$root.$emit("setCommand", "");
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
</style>
