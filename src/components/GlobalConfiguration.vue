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
      <q-toggle
        v-model="timeCalibrationState"
        label="Time Calibration"
        class="q-ma-xs"
      />
    </div>
  </div>
</template>

<script>
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
