<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">
      Response Log
      <q-chip color="negative" dense square v-if="devCommands.length">
        {{ devCommands.length }}
      </q-chip>
    </p>
    <q-scroll-area
      class="bg-white"
      :style="{ height: (height < 150 ? 150 : height) + 'px' }"
    >
      <q-list link dense separator v-if="devCommands.length">
        <q-item
          v-for="(cmd, index) in devCommands"
          :key="index"
          @click.native="applyCommand(cmd.payload)"
        >
          <q-item-main>
            <q-item-tile label>{{ cmd.payload }}</q-item-tile>
            <q-item-tile sublabel>
              <q-chip :color="cmd.resCode.color" dense square>{{
                cmd.resCode.title
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
import { mapState, mapGetters } from 'vuex'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  computed: {
    ...mapState('database', ['loading']),
    ...mapGetters('database', ['devCommands'])
  },
  methods: {
    applyCommand(payload) {
      if (!this.loading) this.$root.$emit('setCommand', payload)
    }
  }
}
</script>

<style>
</style>
