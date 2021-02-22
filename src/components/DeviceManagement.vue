<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Device Management
        <q-badge v-if="devices.length > 0" color="red" align="top">{{
          devices.length
        }}</q-badge>
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
          @click="SET_UNITID(dev.unitID)"
          :active="active(dev)"
          active-class="bg-primary text-white"
          :clickable="!processing"
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">{{
              dev.unitID.toString()
            }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>{{
              getLastReport(dev.unitID)
            }}</q-item-label>
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
import { mapState, mapGetters, mapMutations } from "vuex";
import { get } from "lodash";

export default {
  // name: 'ComponentName',
  props: {
    height: {
      required: true
    }
  },
  computed: {
    ...mapState("db", ["devices"]),
    ...mapGetters("db", ["devDevice", "getTotalReports", "getLastReport"])
  },
  methods: {
    ...mapMutations("db", [SET_UNITID]),
    active({ unitID }) {
      return unitID === get(this.devDevice, "unitID");
    }
  }
};
</script>

<style></style>
