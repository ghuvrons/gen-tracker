<template>
  <div class="shadow-1" :class="darkerClass">
    <p class="q-pa-sm q-mb-none bg-purple text-white">
      Response Log
      <q-chip v-if="devCommands.length > 0" color="negative" dense square>
        {{ devCommands.length }}
      </q-chip>
    </p>
    <q-scroll-area
      :class="darkerClass"
      :style="{ height: (height < 150 ? 150 : height) + 'px' }"
    >
      <q-list v-if="devCommands.length > 0" :dark="darker" link dense separator>
        <q-item
          v-for="(cmd, index) in devCommands"
          :key="index"
          :dark="darker"
          @click.native="applyCommand(cmd.payload)"
        >
          <q-item-main>
            <q-item-tile label>{{ cmd.payload }}</q-item-tile>
            <q-item-tile sublabel>
              <q-chip :color="parseResCode(cmd.resCode).color" dense square>{{
                parseResCode(cmd.resCode).title
              }}</q-chip>
              {{ cmd.message }}
            </q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
      <q-alert v-else icon="info" color="faded" class="q-ma-xs">
        No response yet
      </q-alert>
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
