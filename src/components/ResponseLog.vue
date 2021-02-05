<template>
  <div class="shadow-1" :class="darkerClass">
    <div class="q-pa-xs bg-purple text-white text-subtitle1">
      Response Log
      <q-badge v-if="devCommands.length > 0" color="red" align="top">
        {{ devCommands.length }}
      </q-badge>
    </div>
    <q-scroll-area :style="{ height: (height < 150 ? 150 : height) + 'px' }">
      <q-list v-if="devCommands.length > 0" :dark="darker" separator>
        <q-item
          v-for="(cmd, index) in devCommands"
          @click="applyCommand(cmd.payload)"
          :key="index"
          :dark="darker"
          clickable
        >
          <q-item-section>
            <q-item-label lines="1">{{ cmd.payload }}</q-item-label>
            <q-item-label lines="2" caption>
              {{ cmd.message }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-chip :color="parseResCode(cmd.resCode).color" dark dense square>
              {{ parseResCode(cmd.resCode).title }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>
      <q-banner v-else :dark="darker">
        <template v-slot:avatar>
          <q-icon name="info"></q-icon>
        </template>
        No response yet
      </q-banner>
    </q-scroll-area>
  </div>
</template>

<script>
import { devCommands } from '../store/db/getter-types'
import { SET_THE_CMD_BUFFER } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { parseResCode } from 'components/js/response'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  mixins: [CommonMixin],
  computed: {
    ...mapState('db', ['loading']),
    ...mapGetters('db', [devCommands])
  },
  methods: {
    ...mapMutations('db', [SET_THE_CMD_BUFFER]),
    applyCommand(payload) {
      if (!this.loading) this.SET_THE_CMD_BUFFER(payload)
    },
    parseResCode(code) {
      return parseResCode(code)
    }
  }
}
</script>

<style>
</style>
