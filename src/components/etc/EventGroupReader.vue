<template>
  <q-list :dark="darker" dense>
    <q-scroll-area
      :style="{
        height: (height < 150 ? 150 : height) + 110 + 'px',
      }"
    >
      <template v-for="(event, name) in devEvents">
        <q-collapsible
          :key="name"
          :label="`${name} `"
          :sublabel="`(${event.length}) times`"
          :header-class="`text-${activeEvent(name) ? 'green' : 'grey'}`"
          :dark="darker"
          separator
          dense
        >
          <q-list :dark="darker" dense>
            <q-item
              v-for="evt in event"
              :key="`${name}-${evt.time}`"
              :dark="darker"
              separator
              dense
            >
              <q-item-main>
                <q-item-tile sublabel>
                  {{ evt.time }}
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
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  props: {
    height: Number,
    currentValue: Number
  },
  mixins: [CommonMixin],
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