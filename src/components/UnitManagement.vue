<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Unit Management
        <q-badge v-if="units.length > 0" color="red" align="top">
          {{ units.length }}
        </q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-virtual-scroll :items="units" class="fill-height" separator>
      <template v-slot="{ item: unitID, index }">
        <q-item
          :key="index"
          @click="setTheUnit(unitID)"
          :active="unitID === theUnit"
          active-class="bg-primary text-white"
          :dark="darker"
          clickable
          dense
        >
          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ unitID.toString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip :dark="!darker" dense square>
              {{ getTotalReports(unitID) }}
            </q-chip>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:after>
        <q-banner v-if="units.length == 0" :dark="darker">
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
import { getTotalReports } from "../store/db/getter-types";
import { SET_THE_UNIT } from "../store/db/mutation-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  computed: {
    ...mapState("db", ["units", "theUnit"]),
    ...mapGetters("db", [getTotalReports]),
  },
  methods: {
    ...mapMutations("db", [SET_THE_UNIT]),
    setTheUnit(unitID) {
      if (!this.loading) this.SET_THE_UNIT(unitID);
    },
  },
};
</script>

<style></style>
