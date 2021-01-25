<template>
  <q-list dense>
    <q-scroll-area
      class="bg-white"
      :style="{
        height: (height < 150 ? 150 : height) + 110 + 'px',
      }"
    >
      <template v-for="(events, name) in devEvents">
        <q-collapsible
          :key="name"
          :label="`${name} `"
          :sublabel="`(${events.length}) times`"
          :header-class="`text-${activeEvent(name) ? 'green' : 'grey'}`"
          separator
          dense
        >
          <q-list dense>
            <q-item
              v-for="event in devEvents"
              :key="`${name}-${event.logDatetime}`"
              separator
              dense
            >
              <q-item-main>
                <q-item-tile sublabel>
                  {{ event.logDatetime }}
                </q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-collapsible>
      </template>
    </q-scroll-area>
  </q-list>
</template>

<script>
import { EVENT_LIST, parseEvent } from 'components/js/event'
import { devEvents } from '../../store/db/getter-types'
import { mapGetters } from 'vuex'

export default {
  props: {
    height: Number,
    currentValue: Number
  },
  data() {
    return {
      EVENT_LIST: this.$_.cloneDeep(EVENT_LIST)
    }
  },
  computed: {
    ...mapGetters('db', [devEvents])
  },
  methods: {
    activeEvent(_name) {
      let bit = EVENT_LIST.find(({ name }) => name === _name).bit
      return parseEvent(this.currentValue, bit)
    }
  }
}
</script>

<style>
</style>