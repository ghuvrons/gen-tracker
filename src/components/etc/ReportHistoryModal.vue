<template>
  <q-dialog
    :model-value="true"
    :maximized="$q.screen.lt.md"
    persistent
    full-height
    full-width
  >
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>
            <span v-if="$q.screen.gt.sm" class="text-weight-bold">HISTORY</span>
            {{ this.theField.title }}
            <q-chip dark dense square>
              {{ range.bar.max + 1 }}
            </q-chip>
          </q-toolbar-title>
          <q-btn round dense push icon="close" @click="$emit('close')" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" padding>
          <div class="row">
            <div
              :class="
                eventField ? 'col-xs-12 col-sm-12 col-md-8 col-lg-9' : 'col-12'
              "
            >
              <div class="q-pa-sm">
                <chart-line
                  style="height: 60vh"
                  :param="chart"
                  :updateData="update.data"
                  :updateOptions="update.options"
                />
                <q-range
                  v-model="range.val"
                  :min="range.bar.min"
                  :max="range.bar.max"
                  :disable="range.disable"
                  :drag-only-range="control.lock"
                  :left-label-value="range.val.min + 1"
                  :right-label-value="range.val.max + 1"
                  label-always
                  square
                />
                <div class="row justify-between items-center content-center">
                  <div class="col-auto">
                    <q-toggle
                      v-model="control.beginAtZero"
                      label="Begin Zero"
                      class="q-ma-xs"
                    />
                    <q-toggle
                      v-model="control.lock"
                      :disable="control.maximize"
                      label="Lock Window"
                      class="q-ma-xs"
                    />
                    <q-toggle
                      v-model="control.follow"
                      :disable="control.maximize"
                      label="Follow Data"
                      class="q-ma-xs"
                    />
                    <q-toggle
                      v-model="control.maximize"
                      label="Max Range"
                      class="q-ma-xs"
                    />
                  </div>
                  <div class="col-auto">
                    <q-input
                      :model-value="range.val.max + 1 - range.val.min"
                      type="number"
                      class="q-ma-xs"
                      style="width: 130px"
                      prefix="Sample :"
                      disable
                      hide-bottom-space
                      filled
                      dense
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="eventField"
              class="col-xs-12 col-sm-12 col-md-4 col-lg-3"
            >
              <div class="q-pa-sm scroll">
                <event-reader :field="field" :value="latestValue"></event-reader>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import ChartLine from "components/etc/ChartLine";
import EventReader from "components/etc/EventReader";

import useChart from "src/composables/useChart";

import { FIELD_EVENTS } from "src/js/opt/event";
import { getField } from "src/js/utils";
import { Report } from "src/js/report";

import { useQuasar } from "quasar";

import {
  computed,
  reactive,
  watch,
  onMounted,
  toRefs,
  defineComponent
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  // name: 'ComponentName',
  emits: ["close"],
  props: {
    field: {
      required: true
    }
  },
  components: {
    ChartLine,
    EventReader
  },
  setup(props) {
    const $q = useQuasar();
    const store = useStore();
    const devReports = computed(() => store.getters[`db/devReports`]);

    const {
      chart,
      update,
      latestValue,
      setLabel,
      setColor,
      scaleChart,
      writeChart
    } = useChart();

    const state = reactive({
      tmp: {
        max: null,
        min: null,
        follow: false,
        lock: false
      },
      range: {
        disable: false,
        sample: 10,
        bar: {
          min: 0,
          max: null
        },
        val: {
          min: 0,
          max: null
        }
      },
      control: {
        beginAtZero: false,
        maximize: true,
        follow: false,
        lock: false
      }
    });

    const theField = computed(() => getField(Report, props.field));
    const eventField = computed(
      () => Object.keys(FIELD_EVENTS).includes(props.field)
    );

    const applyRange = () => {
      const top = state.range.bar.max;
      let { min, max } = state.range.val;
      let sample = max - min;

      if (!state.control.maximize) {
        if (!max) {
          max = top;
          sample = state.range.sample;
        }

        if (state.control.follow) {
          max = top;

          if (!state.control.lock) sample = max - min;
        } else {
          if (!state.control.lock) {
            if (max == top) sample++;
            else max++;
          }
        }
      } else {
        max = top;
        sample = top + 1;
      }

      max = max > top ? top : max;
      min = max - sample;

      state.range.val = {
        min: min > 0 ? min : 0,
        max: max
      };
    };
    const writeChartRange = () => {
      state.range.bar = writeChart(devReports.value, props.field);
      applyRange();
    };
    const scaleChartOpen = () => scaleChart(state.control, state.range.val);

    onMounted(() => {
      setLabel(props.field);
      writeChartRange();
    });

    watch(
      () => devReports.value.length,
      (len) => {
        if (len == 0) return;
        writeChartRange();
      },
      {
        // lazy: false, immediate: true,
        deep: true
      }
    );
    watch(
      () => state.range.val,
      () => scaleChartOpen(),
      { deep: true }
    );
    watch(
      () => state.control.beginAtZero,
      () => scaleChartOpen()
    );
    watch(
      () => state.control.maximize,
      (max) => {
        if (max) {
          state.tmp.max = state.range.val.max;
          state.tmp.min = state.range.val.min;
          state.tmp.lock = state.control.lock;
          state.tmp.follow = state.control.follow;
          state.range.disable = true;

          state.control.follow = false;
          state.control.lock = false;
        } else {
          state.range.disable = false;
          state.control.follow = state.tmp.follow;
          state.control.lock = state.tmp.lock;
          state.range.val.max = state.tmp.max;
          state.range.val.min = state.tmp.min;
        }
        applyRange();
      },
      { lazy: false, immediate: true }
    );
    watch(
      () => $q.dark.isActive,
      (dark) => setColor(dark ? "#FFF" : "#666"),
      { lazy: false, immediate: true }
    );

    return {
      chart,
      update,
      ...toRefs(state),

      theField,
      latestValue,
      eventField
    };
  }
});
</script>

<style></style>
