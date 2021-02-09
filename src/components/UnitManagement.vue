<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Unit Management
        <q-badge v-if="devices.length > 0" color="red" align="top">{{ devices.length }}</q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-virtual-scroll :items="devices" :style="`height: calc(${height}px - 32px)`" separator>
      <template v-slot="{ item: dev, index }">
        <q-item
          :key="index"
          @click="setDevice(dev.unitID)"
          :active="dev.unitID === device.unitID"
          active-class="bg-primary text-white"
          clickable
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ dev.unitID.toString() }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip :dark="!$q.dark.isActive" dense square>{{ getTotalReports(dev.unitID) }}</q-chip>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:after>
        <q-banner v-if="devices.length == 0">
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
import { SET_DEVICE } from "src/store/db/mutation-types";
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
    ...mapState("db", ["devices", "device"]),
    ...mapGetters("db", [getTotalReports]),
  },
  methods: {
    ...mapMutations("db", [SET_DEVICE]),
    setDevice(unitID) {
      if (!this.loading) this.SET_DEVICE({ unitID });
    },
  },
};
</script>

<style></style>
