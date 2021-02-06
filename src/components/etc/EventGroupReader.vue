<template>
  <q-list :dark="darker" bordered>
    <q-expansion-item
      v-for="(event, name) in devEvents"
      :key="name"
      :label="`${name} `"
      :caption="`(${event.length}) times`"
      :header-class="`text-${activeEvent(name) ? 'green' : 'grey'}`"
      :dark="darker"
      expand-separator
    >
      <q-virtual-scroll :items="event" style="max-height:80vh" separator>
        <template v-slot="{ item: evt, index }">
          <q-item :key="`${name}-${evt.time}`" :dark="darker">
            <q-item-section>
              <q-item-label caption>{{ evt.time }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { EVENT_LIST, parseEvent } from "components/js/event";
import { devEvents } from "../../store/db/getter-types";
import { mapGetters } from "vuex";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  props: {
    currentValue: Number,
  },
  mixins: [CommonMixin],
  data() {
    return {
      EVENT_LIST: this.$_.cloneDeep(EVENT_LIST),
    };
  },
  computed: {
    ...mapGetters("db", [devEvents]),
  },
  methods: {
    activeEvent(_name) {
      let bit = EVENT_LIST.find(({ name }) => name === _name).bit;
      return parseEvent(this.currentValue, bit);
    },
  },
};
</script>

<style>
</style>