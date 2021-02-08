<template>
  <div :style="`height: calc(100vh - ${height}vh - 105px)`">
    <q-virtual-scroll :items="devFingers" separator>
      <template v-slot="{ item: driver, index }">
        <q-item :key="index" :dark="darker">
          <q-item-section avatar>
            <q-chip color="primary" dark square>{{ driver.fingerID }}</q-chip>
          </q-item-section>
          <q-item-section>
            <q-item-label>Mr. {{ name[driver.fingerID - 1] }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              @click="deleteFinger(driver)"
              :loading="loading"
              size="sm"
              icon="delete"
              outline
              unelevated
              round
            />
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:after>
        <q-banner v-if="devFingers.length == 0" :dark="darker">
          <template v-slot:avatar>
            <q-icon name="info"></q-icon>
          </template>
          No finger driver yet
        </q-banner>
      </template>
    </q-virtual-scroll>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        v-model="fab"
        external-label
        vertical-actions-align="right"
        color="secondary"
        icon="keyboard_arrow_left"
        direction="left"
        label-position="top"
        padding="sm"
      >
        <q-fab-action
          @click="fetchFinger"
          :disable="loading || !device"
          label-position="top"
          color="primary"
          icon="download"
          label="Fetch"
          external-label
        />
        <q-fab-action
          @click="addFinger"
          :disable="loading || !device"
          label-position="top"
          color="green"
          icon="upload"
          label="Add"
          external-label
        />
        <q-fab-action
          @click="resetFinger"
          :disable="loading || !device"
          label-position="top"
          color="orange"
          icon="delete_forever"
          label="Reset"
          external-label
        />
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import {
  ADD_FINGERS,
  DELETE_FINGERS,
  RESET_FINGERS,
} from "src/store/db/mutation-types";
import { extractCommand } from "components/js/command";
import { parseResCode } from "components/js/response";
import { VEHICLE_STATES } from "components/js/opt/report";
import { devFingers, devReports } from "src/store/db/getter-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  props: {
    height: {
      required: true,
    },
  },
  data() {
    return {
      name: ["One", "Two", "Three", "Four", "Five"],
      fab: false,
    };
  },
  computed: {
    ...mapState("db", ["device", "responses"]),
    ...mapGetters("db", [devFingers, devReports]),
  },
  mounted() {
    if (this.devReports.length > 0)
      if (this.devReports[0].vehicleState.out >= VEHICLE_STATES["STANDBY"])
        this.fetchFinger();
  },
  methods: {
    ...mapMutations("db", [ADD_FINGERS, DELETE_FINGERS, RESET_FINGERS]),
    fetchFinger() {
      this.$root.$emit("executeCommand", `FINGER_FETCH`);
    },
    addFinger() {
      this.$root.$emit("executeCommand", `FINGER_ADD`);
    },
    deleteFinger({ fingerID }) {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure to remove this fingerprint *${fingerID}* ?`,
          dark: this.darker,
          preventClose: true,
          cancel: true,
        })
        .onOk(() =>
          this.$root.$emit("executeCommand", `FINGER_DEL=${fingerID}`)
        );
    },
    resetFinger() {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure to remove all fingerprints  ?`,
          dark: this.darker,
          preventClose: true,
          cancel: true,
        })
        .onOk(() => this.$root.$emit("executeCommand", `FINGER_RST`));
    },
  },
  watch: {
    responses: {
      deep: true,
      handler(responses) {
        if (responses.length == 0) return;
        let { resCode, payload, unitID, message } = responses[0];

        let res = parseResCode(resCode);
        if (res.title != "OK") return;

        let { prop, value } = extractCommand(payload);
        if (prop == "FINGER_FETCH") {
          if (message.length > 0) {
            let ids = message.split(",");
            for (let i = ids.length - 1; i >= 0; i--)
              this.ADD_FINGERS({ unitID, fingerID: ids[i] });
          }
        } else if (prop == "FINGER_ADD")
          this.ADD_FINGERS({ unitID, fingerID: message });
        else if (prop == "FINGER_DEL")
          this.DELETE_FINGERS({ unitID, fingerID: value });
        else if (prop == "FINGER_RST") this.RESET_FINGERS({ unitID });
      },
    },
  },
};
</script>

<style>
</style>
