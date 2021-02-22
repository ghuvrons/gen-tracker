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
                  :drag-range="control.drag"
                  snap
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
                      v-model="control.drag"
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
                <event-group-reader :value="currentValue"></event-group-reader>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { getField } from "components/js/utils";
import { Report } from "components/js/report";
import LineChart from "components/etc/LineChart";
import EventGroupReader from "components/etc/EventGroupReader";
import { Dark } from "quasar";
import {
  findRange,
  findRangeX,
  findRangeY,
  getLabel,
  grabDatasets
} from "components/js/chart";
import useChart from "components/js/composables/useChart";
import {
  computed,
  reactive,
  watch,
  onMounted,
  toRefs
} from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default {
  // name: 'ComponentName',
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
        sample: null,
        follow: false,
        drag: false
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
        drag: false
      }
    });

    const { useGetters } = createNamespacedHelpers("db");
    const { devReports, devEvents } = useGetters(["devReports", "devEvents"]);

    const theField = computed(() => getField(Report, props.field));
    const currentValue = computed(() => {
      let { data } = chart.value.data.datasets[0];
      return data[data.length - 1];
    });
    const eventGroup = computed(
      () =>
        props.field == "eventsGroup" && Object.keys(devEvents.value).length > 0
    );
    const rangeSample = computed(() => {
      let { iMin, iMax } = findRange(chart.value.data, state.range.value);
      return iMax - iMin + 1;
    });

    const applyRange = sample => {
      let { iMin, iMax } = findRange(chart.value.data, state.range.value);
      let { xMax } = findRangeX(chart.value.data, { iMin, iMax });
      let oldSample = iMax - iMin;

      if (state.control.maximize || state.control.follow) {
        iMax = chart.value.data.labels.length - 1;
        xMax = getLabel(chart.value.data, iMax);
        if (state.control.maximize) iMin = 0;
      }

      if (!sample) {
        sample = iMax - iMin;
        if (state.control.drag) {
          sample = oldSample;
          if (!state.control.follow)
            xMax = getLabel(chart.value.data, iMin + sample);
        }
      } else sample--;

      state.range.value = {
        min: getLabel(chart.value.data, iMax - sample),
        max: xMax
      };
    };
    const scaleChart = () => {
      let indexes = findRange(chart.value.data, state.range.value);
      let { xMin, xMax } = findRangeX(chart.value.data, indexes);
      let { yMin, yMax } = findRangeY(
        chart.value.data.datasets[0],
        state.control,
        indexes
      );

      setScales({ xMin, xMax, yMin, yMax }, state.control);
      state.modalOpen = true;
    };
    const writeChart = reports => {
      setData(grabDatasets(reports, props.field));

      state.range.min = getLabel(chart.value.data, 0);
      state.range.max = getLabel(chart.value.data, -1);
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
      () => Dark.isActive,
      dark => setColor(dark ? "#FFF" : "#666"),
      { lazy: false }
    );
    watch(
      () => devReports.value[0],
      devReport => {
        if (!devReport) return;
        if (!devReport[props.field]) return;

        writeChart([devReport]);
        applyRange();
      }
    );
    watch(
      () => state.control.maximize,
      max => {
        let sample = null;
        if (max) {
          state.tmp.max = state.range.value.max;
          state.tmp.sample = state.rangeSample;
          state.tmp.drag = state.control.drag;
          state.tmp.follow = state.control.follow;
          state.range.disable = true;

          state.control.follow = false;
          state.control.drag = false;
        } else {
          state.range.disable = false;
          state.control.follow = state.tmp.follow;
          state.control.drag = state.tmp.drag;
          state.range.value.max = state.tmp.max;
          sample = state.tmp.sample;
        }
        applyRange(sample);
      },
      { lazy: false }
    );

    return {
      chart,
      history,
      ...toRefs(state),

      theField,
      currentValue,
      eventGroup,
      rangeSample
    };
  }
};
</script>

<style></style>
