<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Unit Management
        <q-badge v-if="devices.length > 0" color="red" align="top">{{ devices.length }}</q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-virtual-scroll :items="devices" :style="`height: calc(${height}px - 32px)`" separator>
      <template v-slot="{ item: device, index }">
        <q-item
          :key="index"
          @click="setTheDevice(device.unitID)"
          :active="device.unitID === theDevice.unitID"
          active-class="bg-primary text-white"
          :dark="darker"
          clickable
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ device.unitID.toString() }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip :dark="!darker" dense square>{{ getTotalReports(device.unitID) }}</q-chip>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:after>
        <q-banner v-if="devices.length == 0" :dark="darker">
          <template v-slot:avatar>
            <q-icon name="info"></q-icon>
          </template>
          No unit yet
        </q-banner>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { getTotalReports } from "src/store/db/getter-types";
import { SET_THE_DEVICE } from "src/store/db/mutation-types";
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
  computed: {
    ...mapState("db", ["devices", "theDevice"]),
    ...mapGetters("db", [getTotalReports]),
  },
  methods: {
    ...mapMutations("db", [SET_THE_DEVICE]),
    setTheDevice(unitID) {
      if (!this.loading) this.SET_THE_DEVICE({ unitID });
    },
  },
};
</script>

<style></style>
