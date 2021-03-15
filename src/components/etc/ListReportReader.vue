<template>
  <q-virtual-scroll :items="fields" :style="height" separator>
    <template v-slot="{ item: field }">
      <q-item
        :key="field"
        @click="$emit('update:selected', field)"
        :active="selected == field"
        active-class="bg-primary text-white"
        clickable
      >
        <q-item-section>
          <q-item-label lines="1">{{ report[field].title }}</q-item-label>
          <q-item-label lines="2" caption>
            {{ report[field].out }}
            {{ report[field].unit }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon
            :name="realtime(field) ? 'cloud_download' : 'cloud_off'"
            :color="realtime(field) ? 'green' : 'red'"
          ></q-icon>
        </q-item-section>
      </q-item>
    </template>
  </q-virtual-scroll>
</template>

<script>
import { Report } from "src/js/report";
import { getField, frameId } from "src/js/utils";

import { omit } from "lodash";
import { computed, defineComponent } from "vue";

export default defineComponent({
  emits: ["update:selected"],
  props: {
    report: {
      required: true
    },
    selected: {
      required: true
    },
    height: {
      required: true
    }
  },
  setup(props) {
    const fields = computed(() => Object.keys(omit(props.report, "hex")));

    const realtime = (field) => {
      const { required } = getField(Report, field);
      return frameId(props.report.frameID.val) == "FULL" || required;
    };

    return {
      fields,

      realtime
    };
  }
});
</script>

<style>
</style>
