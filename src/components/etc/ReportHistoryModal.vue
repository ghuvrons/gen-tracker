<template>
  <q-dialog
    v-model="modalOpen"
    @hide="$emit('close')"
    :maximized="$q.screen.lt.md"
    full-height
    full-width
  >
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>
            <span v-if="$q.screen.gt.sm" class="text-weight-bold">HISTORY</span>
            {{ this.theField.title }}
            <q-chip v-if="chart.data" dark dense square>{{
              chart.data.labels.length
            }}</q-chip>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" padding>
          <div class="row">
            <div
              :class="
                eventGroup ? 'col-xs-12 col-sm-12 col-md-8 col-lg-9' : 'col-12'
              "
            >
              <div class="q-pa-sm">
                <line-chart
                  style="height: 60vh"
                  :param="chart"
                  :update="history.update"
                />
                <q-range
                  v-model="range.value"
                  :min="range.min"
                  :max="range.max"
                  :disable="range.disable"
                  :drag-only-range="control.lock"
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
                      :value="rangeSample"
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
              v-if="eventGroup"
              class="col-xs-12 col-sm-12 col-md-4 col-lg-3"
            >
              <div class="q-pa-sm scroll">
                <event-group-reader :value="latestValue"></event-group-reader>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { getField } from "src/js/utils";
import { Report } from "src/js/report";
import LineChart from "components/etc/LineChart";
import EventGroupReader from "components/etc/EventGroupReader";
import { Dark } from "quasar";
import { findRangeX, findRangeY, grabDatasets } from "src/js/chart";
import useChart from "src/composables/useChart";

import {
  computed,
  reactive,
  watch,
  onMounted,
  toRefs
} from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  emits: ["close"],
  props: {
    field: {
      required: true
    }
  },
  components: {
    LineChart,
    EventGroupReader
  },
  setup(props) {
    const {
      chart,
      history,
      setScales,
      setData,
      setLabel,
      setColor
    } = useChart();

    const state = reactive({
      modalOpen: false,
      tmp: {
        max: null,
        min: null,
        follow: false,
        lock: false
      },
      range: {
        disable: false,
        sample: 10,
        min: 0,
        max: null,
        value: {
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

    const { devReports, devEvents } = useGetters(["devReports", "devEvents"]);

    const theField = computed(() => getField(Report, props.field));
    const eventGroup = computed(
      () =>
        props.field == "eventsGroup" && Object.keys(devEvents.value).length > 0
    );
    const latestValue = computed(
      () => chart.value.data.datasets[0].data.slice(-1)[0]
    );
    const rangeSample = computed(
      () => state.range.value.max - state.range.value.min
    );

    const applyRange = () => {
      let { min, max } = state.range.value;
      let sample = max - min;

      if (!state.control.maximize) {
        if (!max) {
          max = chart.value.data.labels.length - 1;
          sample = state.range.sample;
        }

        if (state.control.follow) {
          max = chart.value.data.labels.length - 1;

          if (!state.control.lock) sample = max - min + 1;
        } else {
          if (!state.control.lock) sample++;
        }
      } else {
        sample = chart.value.data.labels.length;
        max = sample - 1;
      }

      min = max - sample;
      state.range.value = {
        min: min < 0 ? 0 : min,
        max: max
      };
    };
    const scaleChart = () => {
      let { xMin, xMax } = findRangeX(chart.value.data, state.range.value);
      let { yMin, yMax } = findRangeY(
        chart.value.data.datasets[0],
        state.control,
        state.range.value
      );

      setScales({ xMin, xMax, yMin, yMax }, state.control);
      state.modalOpen = true;
    };
    const writeChart = reports => {
      setData(grabDatasets(reports, props.field));

      state.range.min = 0;
      state.range.max = reports.length - 1;
    };

    onMounted(() => {
      setLabel(props.field);
      writeChart(devReports.value);
      applyRange();
    });

    watch(
      () => state.range.value,
      _ => scaleChart(),
      { deep: true }
    );
    watch(
      () => state.control.beginAtZero,
      _ => scaleChart()
    );
    watch(
      () => state.control.follow,
      follow => {
        if (follow) {
          let sample = state.range.value.max - state.range.value.min;
          state.range.value.max = chart.value.data.labels.length - 1;
          if (state.control.lock)
            state.range.value.min = state.range.value.max - sample;
          applyRange();
        }
      }
    );
    watch(
      () => Dark.isActive,
      dark => setColor(dark ? "#FFF" : "#666"),
      { lazy: false, immediate: true }
    );
    watch(
      () => devReports.value.length,
      len => {
        if (!len) return;

        writeChart(devReports.value);
        applyRange();
      },
      { lazy: false, deep: true }
    );
    watch(
      () => state.control.maximize,
      max => {
        if (max) {
          state.tmp.max = state.range.value.max;
          state.tmp.min = state.range.value.min;
          state.tmp.lock = state.control.lock;
          state.tmp.follow = state.control.follow;
          state.range.disable = true;

          state.control.follow = false;
          state.control.lock = false;
        } else {
          state.range.disable = false;
          state.control.follow = state.tmp.follow;
          state.control.lock = state.tmp.lock;
          state.range.value.max = state.tmp.max;
          state.range.value.min = state.tmp.min;
        }
        applyRange();
      },
      { lazy: false, immediate: true }
    );

    return {
      chart,
      history,
      ...toRefs(state),

      theField,
      latestValue,
      eventGroup,
      rangeSample
    };
  }
};
</script>

<style></style>
