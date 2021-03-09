<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Device Management
        <q-badge v-if="sortedDevices.length > 0" color="red" align="top">
          {{ sortedDevices.length }}
        </q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-banner v-if="sortedDevices.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No unit yet
    </q-banner>
    <q-virtual-scroll v-else :items="sortedDevices" :style="height" separator>
      <template v-slot="{ item: dev }">
        <q-item
          :key="dev.unitID"
          @click="setUnitID(dev.unitID)"
          :active="active(dev)"
          active-class="bg-primary text-white"
          clickable
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ dev.unitID.toString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              {{ fromNow(dev.sendDatetime) }}
            </q-item-label>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              <u v-if="dev.status"><b>ONLINE</b></u>
              <i v-else>OFFLINE</i>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { fromNow } from "src/js/report";

import { SET_UNITID } from "src/store/db/mutation-types";

import { get, orderBy } from "lodash";
import { computed } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
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

    const sortedDevices = computed(() =>
      orderBy(devices.value, "sendDatetime", "desc")
    );

    const active = ({ unitID }) => unitID === get(devDevice.value, "unitID");

    return {
      sortedDevices,

      fromNow,

      setUnitID,
      active
    };
  }
};
</script>

<style></style>
