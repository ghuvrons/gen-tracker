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
          v-for="(unitID, index) in units"
          :key="index"
          @click.native="setTheUnit(unitID)"
          :class="{
            'bg-dark text-white': unitID === theUnit,
          }"
        >
          <q-item-main :label="unitID.toString()" />
          <q-item-side right>
            <q-chip color="primary" dense square>
              {{ getTotalReports(unitID) }}
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
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  // name: 'ComponentName',
  created() {
    this.setTheUnit()
  },
  props: {
    height: Number
  },
  computed: {
    ...mapState('database', ['units', 'theUnit', 'loading']),
    ...mapGetters('database', ['getTotalReports'])
  },
  methods: {
    ...mapMutations('database', ['SET_THE_UNIT']),
    setTheUnit(unitID) {
      if (!this.loading)
        if (this.units.length) this.SET_THE_UNIT(unitID || this.units[0])
    }
  }
}
</script>

<style></style>
