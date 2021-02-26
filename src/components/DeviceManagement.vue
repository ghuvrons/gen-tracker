<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Device Management
        <q-badge v-if="listDevice.length > 0" color="red" align="top">
          {{ listDevice.length }}
        </q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-banner v-if="listDevice.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No unit yet
    </q-banner>
    <q-virtual-scroll v-else :items="listDevice" :style="height" separator>
      <template v-slot="{ item: dev }">
        <q-item
          :key="dev.unitID"
          @click="setUnitID(dev.unitID)"
          :active="active(dev)"
          active-class="bg-primary text-white"
          :clickable="!processing"
          dense
        >
          <q-item-section side>
            <q-icon
              :name="dev.status ? 'play_circle' : 'pause_circle'"
              :color="dev.status ? 'green' : 'red'"
            ></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ dev.unitID.toString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              {{ lastSendDatetime(dev.sendDatetime) }}
            </q-item-label>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              <b>{{ dev.total }}</b> reports
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { SET_UNITID } from "src/store/db/mutation-types";
import { lastSendDatetime } from "src/js/report";

import { get, orderBy } from "lodash";
import { createNamespacedHelpers } from "vuex-composition-helpers";
import { computed } from "@vue/composition-api";
const { useState, useMutations, useGetters } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  props: {
    height: {
      required: true
    }
  },
  setup(props) {
    const { devices } = useState(["devices"]);
    const { [SET_UNITID]: setUnitID } = useMutations([SET_UNITID]);
    const { devDevice } = useGetters(["devDevice"]);

    const listDevice = computed(() =>
      orderBy(devices.value, "sendDatetime", "desc")
    );

    const active = ({ unitID }) => unitID === get(devDevice.value, "unitID");

    return {
      listDevice,

      lastSendDatetime,

      setUnitID,
      active
    };
  }
};
</script>

<style></style>
