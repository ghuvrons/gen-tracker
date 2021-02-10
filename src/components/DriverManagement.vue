<template>
  <div :style="contentStyle">
    <div class="text-subtitle2">Last fetch: {{ fingerTime() }}</div>
    <q-banner v-if="devFingers.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No finger driver yet
    </q-banner>
    <q-virtual-scroll v-else :items="devFingers" separator>
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
              @click="remove(driver)"
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
          @click="fetch"
          :disable="loading || !devDevice"
          label-position="top"
          color="primary"
          icon="download"
          label="Fetch"
          external-label
        />
        <q-fab-action
          @click="add"
          :disable="loading || !devDevice"
          label-position="top"
          color="green"
          icon="upload"
          label="Add"
          external-label
        />
        <q-fab-action
          @click="clear"
          :disable="loading || !devDevice"
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
import { devDevice, devFingers } from "src/store/db/getter-types";
import { mapGetters, mapActions } from "vuex";
import { confirm } from "components/js/framework";
import { get } from "lodash";
import moment from "moment";
import CommonMixin from "components/mixins/CommonMixin";
import { INSERT_COMMAND } from "src/store/db/action-types";

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
    ...mapGetters("db", [devFingers, devDevice]),
  },
  methods: {
    ...mapActions("db", [INSERT_COMMAND]),
    fingerTime() {
      let fingerTime = get(this.devDevice, "fingerTime");

      if (fingerTime)
        return moment.unix(fingerTime).format("DD-MM-YY HH:mm:ss");
      return "Unknown";
    },
    fetch() {
      this.INSERT_COMMAND({ payload: `FINGER_FETCH` });
    },
    add() {
      this.INSERT_COMMAND({ payload: `FINGER_ADD` });
    },
    remove({ fingerID }) {
      confirm(
        `Are you sure to remove this fingerprint ${fingerID} ?`
      ).onOk(() => this.INSERT_COMMAND({ payload: `FINGER_DEL=${fingerID}` }));
    },
    clear() {
      confirm(`Are you sure to clear all fingerprints  ?`).onOk(() =>
        this.INSERT_COMMAND({ payload: `FINGER_RST` })
      );
    },
  },
};
</script>

<style>
</style>
