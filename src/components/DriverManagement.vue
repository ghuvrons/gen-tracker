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
              :loading="processing"
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
        :disable="processing"
      >
        <q-fab-action
          @click="fetch"
          :disable="processing || !devDevice"
          label-position="top"
          color="primary"
          icon="download"
          label="Fetch"
          external-label
        />
        <q-fab-action
          @click="add"
          :disable="processing || !devDevice"
          label-position="top"
          color="green"
          icon="upload"
          label="Add"
          external-label
        />
        <q-fab-action
          @click="clear"
          :disable="processing || !devDevice"
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
import { confirm } from "components/js/framework";
import { get } from "lodash";
import moment from "moment";
import { INSERT_COMMAND } from "src/store/db/action-types";

import { ref } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default {
  // name: 'ComponentName',
  props: {
    contentStyle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { useGetters, useActions } = createNamespacedHelpers("db");
    const { devFingers, devDevice } = useGetters(["devFingers", "devDevice"]);
    const { [INSERT_COMMAND]: insertCommand } = useActions([INSERT_COMMAND]);

    const name = ref(["One", "Two", "Three", "Four", "Five"]);
    const fab = ref(false);

    const getFingerTime = () => {
      let fingerTime = get(devDevice.value, "fingerTime");
      return fingerTime
        ? moment.unix(fingerTime).format("DD-MM-YY HH:mm:ss")
        : "Unknown";
    };
    const fetch = () => insertCommand({ payload: `FINGER_FETCH` });
    const add = () => insertCommand({ payload: `FINGER_ADD` });
    const remove = ({ fingerID }) =>
      confirm(
        `Are you sure to remove this fingerprint ${fingerID} ?`
      ).onOk(() => insertCommand({ payload: `FINGER_DEL=${fingerID}` }));
    const clear = () =>
      confirm(`Are you sure to clear all fingerprints  ?`).onOk(() =>
        insertCommand({ payload: `FINGER_RST` })
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
