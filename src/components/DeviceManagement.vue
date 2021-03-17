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
          :key="dev.vin"
          @click="setVin(dev.vin)"
          :active="active(dev)"
          active-class="bg-primary text-white"
          clickable
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ dev.vin.toString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              {{ fromNow(dev.sendDatetime) }}
            </q-item-label>
            <q-item-label :class="{ 'text-white': active(dev) }" caption>
              <u v-if="dev.online"><b>ONLINE</b></u>
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

import { SET_VIN } from "src/store/db/mutation-types";

import { orderBy } from "lodash";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  // name: 'ComponentName',
  props: {
    height: {
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const devices = computed(() => store.state.db.devices);
    const devDevice = computed(() => store.getters[`db/devDevice`]);
    const setVin = (v) => store.commit(SET_VIN, v);

    const sortedDevices = computed(() =>
      orderBy(devices.value, "sendDatetime", "desc")
    );

    const active = ({ vin }) => vin === devDevice.value?.vin;

    return {
      sortedDevices,

      fromNow,

      setVin,
      active
    };
  }
});
</script>

<style></style>
