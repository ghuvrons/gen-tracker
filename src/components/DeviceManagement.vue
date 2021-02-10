<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Device Management
        <q-badge v-if="devices.length > 0" color="red" align="top">{{ devices.length }}</q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-banner v-if="devices.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No unit yet
    </q-banner>
    <q-virtual-scroll v-else :items="devices" :style="`height: calc(${height}px - 32px)`" separator>
      <template v-slot="{ item: dev, index }">
        <q-item
          :key="index"
          @click="SET_UNITID(dev.unitID)"
          :active="active(dev)"
          active-class="bg-primary text-white"
          :clickable="!loading"
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ dev.unitID.toString() }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label
              :class="{'text-white' : active(dev)}"
              caption
            >{{ devLastReport(dev.unitID) }}</q-item-label>
            <q-item-label :class="{'text-white' : active(dev)}" caption>
              <b>{{ devTotalReports(dev.unitID) }}</b> reports
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { devTotalReports, devLastReport } from "src/store/db/getter-types";
import { SET_UNITID } from "src/store/db/mutation-types";
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
    ...mapState("db", ["devices", "unitID"]),
    ...mapGetters("db", [devTotalReports, devLastReport]),
  },
  methods: {
    ...mapMutations("db", [SET_UNITID]),
    active({ unitID }) {
      return unitID === this.unitID;
    },
  },
};
</script>

<style></style>
