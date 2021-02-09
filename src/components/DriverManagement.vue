<template>
  <div :style="contentStyle">
    <q-banner v-if="devFingers.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No finger driver yet
    </q-banner>
    <template v-else>
      <div class="text-subtitle2">Last fetch: {{ devLastFinger }}</div>
      <q-virtual-scroll :items="devFingers" separator>
        <template v-slot="{ item: driver, index }">
          <q-item :key="index" dense>
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
      </q-virtual-scroll>
    </template>

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
        :disable="loading"
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
import { devFingers, devLastFinger } from "src/store/db/getter-types";
import { mapState, mapGetters } from "vuex";
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
  data() {
    return {
      name: ["One", "Two", "Three", "Four", "Five"],
      fab: false,
    };
  },
  computed: {
    ...mapState("db", ["device"]),
    ...mapGetters("db", [devFingers, devLastFinger]),
  },
  methods: {
    fetchFinger() {
      this.$root.$emit("executeCommand", `FINGER_FETCH`);
    },
    addFinger() {
      this.$root.$emit("executeCommand", `FINGER_ADD`);
    },
    deleteFinger({ fingerID }) {
      this.confirm(
        `Are you sure to remove this fingerprint ${fingerID} ?`
      ).onOk(() =>
        this.$root.$emit("executeCommand", `FINGER_DEL=${fingerID}`)
      );
    },
    resetFinger() {
      this.confirm(`Are you sure to remove all fingerprints  ?`).onOk(() =>
        this.$root.$emit("executeCommand", `FINGER_RST`)
      );
    },
    confirm(message) {
      return this.$q.dialog({
        title: "Confirmation",
        message,
        dark: this.$q.dark.isActive,
        preventClose: true,
        cancel: true,
      });
    },
  },
};
</script>

<style>
</style>
