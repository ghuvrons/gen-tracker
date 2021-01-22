<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">
      Unit Management
      <q-chip color="negative" dense square v-if="units.length > 0">
        {{ units.length }}
      </q-chip>
    </p>
    <q-scroll-area
      class="bg-white"
      :style="{ height: (height < 90 ? 90 : height) + 'px' }"
    >
      <q-list highlight link separator dense v-if="units.length > 0 && theUnit">
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
import { getTotalReports } from '../store/db/getter-types'
import { SET_THE_UNIT } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  computed: {
    ...mapState('db', ['units', 'theUnit', 'loading']),
    ...mapGetters('db', [getTotalReports])
  },
  methods: {
    ...mapMutations('db', [SET_THE_UNIT]),
    setTheUnit(unitID) {
      if (!this.loading) this.SET_THE_UNIT(unitID)
    }
  }
}
</script>

<style></style>
