<template>
  <div class="shadow-1" :class="darkerClass">
    <div class="q-pa-xs bg-purple text-white text-subtitle1">
      Unit Management
      <q-badge v-if="units.length > 0" color="red" align="top">
        {{ units.length }}
      </q-badge>
    </div>
    <q-scroll-area :style="{ height: (height < 90 ? 90 : height) + 'px' }">
      <q-list v-if="units.length > 0 && theUnit" :dark="darker" dense separator>
        <q-item
          v-for="(unitID, index) in units"
          :key="index"
          @click="setTheUnit(unitID)"
          :focused="unitID === theUnit"
          :dark="darker"
          clickable
          manual-focus
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
      </q-list>
      <q-banner v-else :dark="darker">
        <template v-slot:avatar>
          <q-icon name="info"></q-icon>
        </template>
        No unit yet
      </q-banner>
    </q-scroll-area>
  </div>
</template>

<script>
import { getTotalReports } from '../store/db/getter-types'
import { SET_THE_UNIT } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations } from 'vuex'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  mixins: [CommonMixin],
  computed: {
    ...mapState('db', ['units', 'theUnit']),
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
