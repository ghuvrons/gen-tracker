<template>
  <div>
    <q-banner v-if="devEvents.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No events yet
    </q-banner>
    <q-list v-else bordered>
      <q-expansion-item
        v-for="(event, name) in devEvents"
        :key="name"
        :label="`${name} `"
        :caption="`(${event.length}) times`"
        :header-class="`text-${activeEvent(name) ? 'orange' : 'grey'}`"
        group="somegroup"
      >
        <q-virtual-scroll :items="event" style="max-height: 50vh" separator>
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
  </div>
</template>

<script>
import { parseEvent, groupEvent } from "src/js/event";
import { FIELD_EVENTS } from "src/js/opt/event";

import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    modelValue: {
      required: false
    },
    field: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const devReports = computed(() => store.getters[`db/devReports`]);

    const devEvents = computed(() =>
      groupEvent(props.field, devReports.value)
    )

    const activeEvent = (event) => {
      const bit = FIELD_EVENTS[props.field].findIndex((evt) => evt === event);
      return parseEvent(props.modelValue, bit);
    };

    return {
      devEvents,
      activeEvent
    };
  }
});
</script>

<style>
</style>
