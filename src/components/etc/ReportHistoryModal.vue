<template>
  <q-dialog
    v-model="modalOpen"
    @hide="$emit('close')"
    :maximized="$q.screen.lt.md"
    full-height
    full-width
  >
    <q-layout view="Lhh lpR fff" :class="darkerClass" container>
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
        <q-page padding>
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
                  :dark="darker"
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
                      :dark="darker"
                    />
                    <q-toggle
                      v-model="control.drag"
                      :disable="control.maximize"
                      label="Lock Window"
                      class="q-ma-xs"
                      :dark="darker"
                    />
                    <q-toggle
                      v-model="control.follow"
                      :disable="control.maximize"
                      label="Follow Data"
                      class="q-ma-xs"
                      :dark="darker"
                    />
                    <q-toggle
                      v-model="control.maximize"
                      label="Max Range"
                      class="q-ma-xs"
                      :dark="darker"
                    />
                  </div>
                  <div class="col-auto">
                    <q-input
                      :value="rangeSample"
                      :dark="darker"
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
import { cloneDeep } from "lodash";
import { Report } from "components/js/report";
import { min, max, findLastIndex } from "lodash";
import chart from "components/js/opt/chart";
import LineChart from "components/etc/LineChart";
import EventGroupReader from "components/etc/EventGroupReader";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  props: {
    field: {
      required: true,
    },
  },
  mixins: [CommonMixin],
  components: {
    LineChart,
    EventGroupReader,
  },
  data() {
    return {
      currentValue: 0,
      modalOpen: false,
      chart: cloneDeep(chart),
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
      history: {
        update: {
          data: false,
          options: false,
        },
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
      let { iMin, iMax } = this.findRange(this.range.value);
      return iMax - iMin + 1;
    },
  },
  methods: {
    getLabel(index) {
      let { labels } = this.chart.data;

      if (index >= 0) return labels[index];
      return labels[labels.length - 1];
    },
    findRange({ min, max }) {
      let { labels } = this.chart.data;

      // find the index
      let iMin = min ? labels.findIndex((val) => val >= min) : 0;
      let iMax = max
        ? findLastIndex(labels, (val) => val <= max)
        : labels.length - 1;

      return { iMin, iMax };
    },
    findRangeX({ iMin, iMax }) {
      let { labels } = this.chart.data;

      // calculate x-axes
      let xMin = labels[iMin];
      let xMax = labels[iMax];

      return { xMin, xMax };
    },
    findRangeY({ iMin, iMax }) {
      let { data } = this.chart.data.datasets[0];

      // calculate y-axes
      let scope = data.filter((_, i) => i >= iMin && i <= iMax);
      let yMin = min(scope);
      let yMax = max(scope);

      // correction
      if (this.control.beginAtZero) {
        if (yMin > 0) yMin = 0;
        else yMax = 0;
      }
      if (yMax == yMin) {
        if (yMin >= 0) yMax += 1;
        else yMin -= 1;
      }

      return { yMin, yMax };
    },
    applyRange(sample) {
      let { iMin, iMax } = this.findRange(this.range.value);
      let { xMax } = this.findRangeX({ iMin, iMax });
      let oldSample = iMax - iMin;

      if (this.control.maximize || this.control.follow) {
        iMax = this.chart.data.labels.length - 1;
        xMax = this.getLabel(iMax);

        if (this.control.maximize) iMin = 0;
      }

      if (!sample) {
        sample = iMax - iMin;

        if (this.control.drag) {
          sample = oldSample;

          if (!this.control.follow) xMax = this.getLabel(iMin + sample);
        }
      } else sample--;

      this.range.value = {
        min: this.getLabel(iMax - sample),
        max: xMax,
      };
    },
    scaleChart() {
      let { iMin, iMax } = this.findRange(this.range.value);
      let { xMin, xMax } = this.findRangeX({ iMin, iMax });
      let { yMin, yMax } = this.findRangeY({ iMin, iMax });

      this.currentValue = xMax;
      this.chart.options.scales.xAxes[0].ticks.max = xMax;
      this.chart.options.scales.xAxes[0].ticks.min = xMin;
      this.chart.options.scales.yAxes[0].ticks.max = yMax;
      this.chart.options.scales.yAxes[0].ticks.min = yMin;
      this.chart.options.scales.yAxes[0].ticks.beginAtZero = this.control.beginAtZero;

      this.history.update.options = !this.history.update.options;
      this.$nextTick(() => (this.modalOpen = true));
    },
    grabLabelsAndDatasets(reports) {
      let datasets = [];
      let labels = [];

      reports.forEach((report) => {
        if (report[this.field]) {
          datasets.push(report[this.field].val);
          labels.push(report.logDatetime.val);
        }
      });

      return {
        datasets: datasets.reverse(),
        labels: labels.reverse(),
      };
    },
    writeChart(reports) {
      let { labels, datasets } = this.grabLabelsAndDatasets(reports);

      if (reports.length > 1) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = datasets;
      } else {
        this.chart.data.labels.push(labels[0]);
        this.chart.data.datasets[0].data.push(datasets[0]);
      }
      this.range.min = this.getLabel(0);
      this.range.max = this.getLabel(-1);

      this.history.update.data = !this.history.update.data;
    },
    prepareChart() {
      let { title, unit } = this.theField;

      this.chart.data.datasets[0].label = title;
      this.chart.options.scales.yAxes[0].scaleLabel.labelString =
        unit || "Value";

      this.history.update.options = !this.history.update.options;
    },
    changeColor(color) {
      this.chart.options.legend.labels.fontColor = color;
      this.chart.options.scales.xAxes[0].ticks.fontColor = color;
      this.chart.options.scales.xAxes[0].scaleLabel.fontColor = color;
      this.chart.options.scales.xAxes[0].gridLines.color = color;
      this.chart.options.scales.yAxes[0].ticks.fontColor = color;
      this.chart.options.scales.yAxes[0].scaleLabel.fontColor = color;
      this.chart.options.scales.yAxes[0].gridLines.color = color;
    },
  },
  mounted() {
    this.prepareChart();
    this.writeChart(this.devReports);
    this.applyRange();
  },
  watch: {
    devReports: {
      handler(devReports) {
        if (devReports.length == 0) return;

        let devReport = devReports[0];
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
    darker: {
      immediate: true,
      handler(dark) {
        this.changeColor(dark ? "#FFF" : "#666");
        this.history.update.options = !this.history.update.options;
      },
    },
  },
};
</script>

<style></style>
