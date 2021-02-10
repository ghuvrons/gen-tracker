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
            <q-chip v-if="chart.data" dark dense square>{{ chart.data.labels.length }}</q-chip>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page :class="$q.dark.isActive ? 'bg-black': 'bg-white'" padding>
          <div class="row">
            <div
              :class="
                eventGroup ? 'col-xs-12 col-sm-12 col-md-8 col-lg-9' : 'col-12'
              "
            >
              <div class="q-pa-sm">
                <line-chart style="height: 60vh" :param="chart" :update="history.update" />
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
                    <q-toggle v-model="control.beginAtZero" label="Begin Zero" class="q-ma-xs" />
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
                    <q-toggle v-model="control.maximize" label="Max Range" class="q-ma-xs" />
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

            <div v-if="eventGroup" class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
              <div class="q-pa-sm scroll">
                <event-group-reader :current-value="currentValue"></event-group-reader>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { devReports, devEvents } from "src/store/db/getter-types";
import { mapGetters } from "vuex";
import { getField } from "components/js/utils";
import { Report } from "components/js/report";
import LineChart from "components/etc/LineChart";
import EventGroupReader from "components/etc/EventGroupReader";
import CommonMixin from "components/mixins/CommonMixin";
import ChartMixin from "components/mixins/ChartMixin";
import {
  findRange,
  findRangeX,
  findRangeY,
  getLabel,
  grabDatasets,
} from "components/js/chart";

export default {
  // name: 'ComponentName',
  props: {
    field: {
      required: true,
    },
  },
  mixins: [CommonMixin, ChartMixin],
  components: {
    LineChart,
    EventGroupReader,
  },
  data() {
    return {
      currentValue: 0,
      modalOpen: false,
      tmp: {
        max: null,
        sample: null,
        follow: false,
        drag: false,
      },
      range: {
        disable: false,
        sample: 10,
        min: 0,
        max: null,
        value: {
          min: 0,
          max: null,
        },
      },
      control: {
        beginAtZero: false,
        maximize: true,
        follow: false,
        drag: false,
      },
    };
  },
  computed: {
    ...mapGetters("db", [devReports, devEvents]),
    theField() {
      return getField(Report, this.field);
    },
    eventGroup() {
      return (
        this.field === "eventsGroup" && Object.keys(this.devEvents).length > 0
      );
    },
    rangeSample() {
      let { iMin, iMax } = findRange(this.chart.data, this.range.value);
      return iMax - iMin + 1;
    },
  },
  methods: {
    applyRange(sample) {
      let { iMin, iMax } = findRange(this.chart.data, this.range.value);
      let { xMax } = findRangeX(this.chart.data, { iMin, iMax });
      let oldSample = iMax - iMin;

      if (this.control.maximize || this.control.follow) {
        iMax = this.chart.data.labels.length - 1;
        xMax = getLabel(this.chart.data, iMax);
        if (this.control.maximize) iMin = 0;
      }

      if (!sample) {
        sample = iMax - iMin;
        if (this.control.drag) {
          sample = oldSample;
          if (!this.control.follow)
            xMax = getLabel(this.chart.data, iMin + sample);
        }
      } else sample--;

      this.range.value = {
        min: getLabel(this.chart.data, iMax - sample),
        max: xMax,
      };
    },
    scaleChart() {
      let indexes = findRange(this.chart.data, this.range.value);
      let { xMin, xMax } = findRangeX(this.chart.data, indexes);
      let { yMin, yMax } = findRangeY(
        this.chart.data.datasets[0],
        this.control,
        indexes
      );

      this.currentValue = xMax;
      this.setChartScales({ xMin, xMax, yMin, yMax }, this.control);
      this.$nextTick(() => (this.modalOpen = true));
    },
    writeChart(reports) {
      this.setChartData(grabDatasets(reports, this.field));

      this.range.min = getLabel(this.chart.data, 0);
      this.range.max = getLabel(this.chart.data, -1);
    },
  },
  mounted() {
    this.setChartLabel(this.field);
    this.writeChart(this.devReports);
    this.applyRange();
  },
  watch: {
    "devReports.0": {
      handler(devReport) {
        if (!devReport) return;
        if (!devReport[this.field]) return;

        this.writeChart([devReport]);
        this.applyRange();
      },
    },
    "control.maximize": {
      immediate: true,
      handler(max) {
        let sample = null;
        if (max) {
          this.tmp.max = this.range.value.max;
          this.tmp.sample = this.rangeSample;
          this.tmp.drag = this.control.drag;
          this.tmp.follow = this.control.follow;
          this.range.disable = true;

          this.control.follow = false;
          this.control.drag = false;
        } else {
          this.range.disable = false;
          this.control.follow = this.tmp.follow;
          this.control.drag = this.tmp.drag;
          this.range.value.max = this.tmp.max;
          sample = this.tmp.sample;
        }
        this.applyRange(sample);
      },
    },
    "range.value": {
      deep: true,
      handler(_) {
        this.scaleChart();
      },
    },
    "control.beginAtZero": {
      handler(_) {
        this.scaleChart();
      },
    },
    "$q.dark.isActive": {
      immediate: true,
      handler(dark) {
        this.setChartColor(dark ? "#FFF" : "#666");
      },
    },
  },
};
</script>

<style></style>
