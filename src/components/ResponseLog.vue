<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">
      Response Log
      <q-chip color="negative" dense square v-if="devCommands.length > 0">
        {{ devCommands.length }}
      </q-chip>
    </p>
    <q-scroll-area
      class="bg-white"
      :style="{ height: (height < 150 ? 150 : height) + 'px' }"
    >
      <q-list link dense separator v-if="devCommands.length > 0">
        <q-item
          v-for="(cmd, index) in devCommands"
          :key="index"
          @click.native="applyCommand(cmd.payload)"
        >
          <q-item-main>
            <q-item-tile label>{{ cmd.payload }}</q-item-tile>
            <q-item-tile sublabel>
              <q-chip :color="cmd.res.color" dense square>{{
                cmd.res.title
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
import { SET_COMMAND_BUFFER } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  computed: {
    ...mapState('db', ['loading']),
    ...mapGetters('db', [devCommands])
  },
  methods: {
    ...mapMutations('db', [SET_COMMAND_BUFFER]),
    applyCommand(payload) {
      if (!this.loading) this.SET_COMMAND_BUFFER(payload)
    }
  }
}
</script>

<style>
</style>
