<template>
  <div :style="contentStyle">
    <div class="text-subtitle2">Last fetch: {{ getFingerTime() }}</div>
    <q-banner v-if="devFingers.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No finger driver yet
    </q-banner>
    <q-virtual-scroll v-else :items="devFingers" separator>
      <template v-slot="{ item: driver }">
        <q-item :key="driver.fingerID" dense>
          <q-item-section avatar>
            <q-chip color="primary" dark square>{{ driver.fingerID }}</q-chip>
          </q-item-section>
          <q-item-section>
            <q-item-label>Mr. {{ name[driver.fingerID - 1] }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              @click="remove(driver)"
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
      >
        <q-fab-action
          @click="fetch"
          :disable="!devDevice"
          label-position="top"
          color="primary"
          icon="download"
          label="Fetch"
          external-label
        />
        <q-fab-action
          @click="add"
          :disable="!devDevice"
          label-position="top"
          color="green"
          icon="upload"
          label="Add"
          external-label
        />
        <q-fab-action
          @click="clear"
          :disable="!devDevice"
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
import dayjs from "src/js/dayjs";
import { confirm } from "src/js/framework";

import { get } from "lodash";
import { ref, inject } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  props: {
    contentStyle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const sendCommand = inject("sendCommand");

    const { devFingers, devDevice } = useGetters(["devFingers", "devDevice"]);

    const name = ref(["One", "Two", "Three", "Four", "Five"]);
    const fab = ref(false);

    const getFingerTime = () => {
      let fingerTime = get(devDevice.value, "fingerTime");
      return fingerTime
        ? dayjs.unix(fingerTime).format("DD-MM-YY HH:mm:ss")
        : "Unknown";
    };
    const fetch = () => sendCommand(`FINGER_FETCH`);
    const add = () => sendCommand(`FINGER_ADD`);
    const remove = ({ fingerID }) =>
      confirm(
        `Are you sure to remove this fingerprint ${fingerID} ?`
      ).onOk(() => sendCommand(`FINGER_DEL=${fingerID}`));
    const clear = () =>
      confirm(`Are you sure to clear all fingerprints  ?`).onOk(() =>
        sendCommand(`FINGER_RST`)
      );

    return {
      name,
      fab,

      devFingers,
      devDevice,

      getFingerTime,
      fetch,
      add,
      remove,
      clear
    };
  }
};
</script>

<style>
</style>
