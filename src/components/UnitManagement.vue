<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">
      Unit Management
      <q-chip color="negative" dense square v-if="units.length">
        {{ units.length }}
      </q-chip>
    </p>
    <q-scroll-area
      class="bg-white"
      :style="{ height: (height < 90 ? 90 : height) + 'px' }"
    >
      <q-list highlight link separator dense v-if="units.length && theUnit">
        <q-item
          v-for="(el, index) in units"
          :key="index"
          @click.native="setTheUnit(el)"
          :class="{ 'bg-dark text-white': el.unitID === theUnit.unitID }"
        >
          <q-item-main :label="el.unitID.toString()" />
          <q-item-side right>
            <q-chip color="primary" dense square>
              {{ getTotalReports(el.unitID) }}
            </q-chip>
          </q-item-side>
        </q-item>
      </q-list>
      <q-alert v-else icon="info" color="faded" class="q-ma-xs">
        No unit yet
      </q-alert>
    </q-scroll-area>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  // name: 'ComponentName',
  created() {
    this.setTheUnit();
  },
  props: {
    height: Number
  },
  computed: {
    ...mapState("database", ["units", "theUnit", "loading"]),
    ...mapGetters("database", ["getTotalReports"])
  },
  methods: {
    ...mapMutations("database", ["SET_THE_UNIT"]),
    setTheUnit(unit) {
      if (!this.loading) {
        if (this.units.length) {
          // set the unit
          this.SET_THE_UNIT(unit || this.units[0]);
        }
      }
    }
  }
};
</script>

<style></style>
