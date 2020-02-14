<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">Response Log
      <q-chip
        color="negative"
        dense
        square
        v-if="selectedResponses.length"
      >
        {{selectedResponses.length}}
      </q-chip>
    </p>
    <q-scroll-area
      class="bg-white"
      :style="{height: (height < 150 ? 150 : height) + 'px'}"
    >
      <q-list
        link
        dense
        separator
        v-if="selectedResponses.length"
      >
        <q-item
          v-for="(response, index) in selectedResponses"
          :key="index"
          @click.native="setCommand(response)"
        >
          <q-item-main>
            <q-item-tile label>{{ response.command }}</q-item-tile>
            <q-item-tile sublabel>
              <q-chip
                :color="response.code.color"
                dense
                square
              >{{ response.code.title }}</q-chip> {{ response.message }}
            </q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
      <q-alert
        v-else
        icon="info"
        color="faded"
        class="q-ma-xs"
      >
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
  data () {
    return {
      theResponse: null
    }
  },
  computed: {
    ...mapState('database', ['loading']),
    ...mapGetters('database', ['selectedResponses'])
  },
  methods: {
    setCommand (response) {
      if (!this.loading) {
        this.theResponse = response
        this.$root.$emit('setCommand', response.command)
      }
    }
  }
}
</script>

<style>
</style>
