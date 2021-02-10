<template>
  <q-list bordered>
    <q-expansion-item
      v-for="(event, name) in devEvents"
      :key="name"
      :label="`${name} `"
      :caption="`(${event.length}) times`"
      :header-class="`text-${activeEvent(name) ? 'green' : 'grey'}`"
      expand-separator
    >
      <q-virtual-scroll :items="event" style="max-height:50vh" separator>
        <template v-slot="{ item: evt }">
          <q-item :key="`${name}-${evt.time}`">
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
import { devEvents } from "src/store/db/getter-types";
import { mapGetters } from "vuex";
import { cloneDeep } from "lodash";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  props: {
    currentValue: Number,
  },
  mixins: [CommonMixin],
  data() {
    return {
      EVENT_LIST: cloneDeep(EVENT_LIST),
    };
  },
  computed: {
    ...mapGetters("db", [devEvents]),
  },
  methods: {
    activeEvent(theName) {
      let bit = EVENT_LIST.find(({ name }) => name === theName).bit;
      return parseEvent(this.currentValue, bit);
    },
  },
};
</script>

<style>
</style>