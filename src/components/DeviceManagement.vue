<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Device Management
        <q-badge v-if="devices.length > 0" color="red" align="top">
          {{ devices.length }}
        </q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-banner v-if="devices.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No unit yet
    </q-banner>
    <q-virtual-scroll v-else :items="devices" :style="height" separator>
      <template v-slot="{ item: dev, index }">
        <q-item
          :key="index"
          @click="setUnitID(dev.unitID)"
          :active="active(dev)"
          active-class="bg-primary text-white"
          :clickable="!processing"
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ dev.unitID.toString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              {{ getLastReport(dev.unitID) }}
            </q-item-label>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              <b>{{ getTotalReports(dev.unitID) }}</b> reports
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { SET_UNITID } from "src/store/db/mutation-types";
import { get } from "lodash";

import { createNamespacedHelpers } from "vuex-composition-helpers";

export default {
  // name: 'ComponentName',
  props: {
    height: {
      required: true
    }
  },
  setup(props) {
    const { useState, useMutations, useGetters } = createNamespacedHelpers(
      "db"
    );
    const { devices } = useState(["devices"]);
    const { [SET_UNITID]: setUnitID } = useMutations([SET_UNITID]);
    const { devDevice, getTotalReports, getLastReport } = useGetters([
      "devDevice",
      "getTotalReports",
      "getLastReport"
    ]);

    const active = ({ unitID }) => unitID === get(devDevice.value, "unitID");

    return {
      devices,
      devDevice,
      getTotalReports,
      getLastReport,

      setUnitID,
      active
    };
  }
};
</script>

<style></style>
