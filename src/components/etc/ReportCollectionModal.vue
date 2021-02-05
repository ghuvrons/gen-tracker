<template>
  <q-modal
    v-model="modalOpen"
    @show="collection.render = true"
    @hide="stopRender()"
    :content-css="{ minWidth: '90vw', minHeight: '95vh' }"
  >
    <q-modal-layout :class="darkerClass">
      <q-toolbar slot="header">
        <q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />
        <q-toolbar-title>
          Report Collection
          <q-chip color="red" dense square v-if="chart.data">{{
            chart.data.labels.length
          }}</q-chip>
        </q-toolbar-title>
      </q-toolbar>

      <q-toolbar slot="footer">
        <q-toolbar-title class="q-pa-xs">
          <q-btn color="primary" @click="modalOpen = false" label="Close" />
        </q-toolbar-title>
      </q-toolbar>

      <div class="layout-padding" v-if="collection.render">
        <div class="row gutter-xs">
          <div
            :class="
              eventGroup ? 'col-xs-12 col-sm-12 col-md-7 col-lg-8' : 'col-12'
            "
          >
            <line-chart
              :styles="{
                height: (height < 200 ? 200 : height) + 'px',
              }"
              :param="chart"
              :update="collection.update"
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
                  type="number"
                  class="q-ma-xs"
                  style="width: 130px"
                  prefix="Sample :"
                  inverted
                  align="right"
                  disable
                  :dark="darker"
                />
              </div>
            </div>
          </div>

          <div v-if="eventGroup" class="col">
            <event-group-reader
              :height="height"
              :current-value="currentValue"
            ></event-group-reader>
          </div>
        </div>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { devReports, devEvents } from '../../store/db/getter-types'
import { mapGetters } from 'vuex'
import { getField } from 'components/js/utils'
import { chart } from 'components/js/opt/config'
import { cloneDeep } from 'lodash'
import { Report } from 'components/js/report'
import LineChart from 'components/etc/LineChart'
import EventGroupReader from 'components/etc/EventGroupReader'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'ComponentName',
  props: {
    value: {
      required: true
    },
    height: Number
  },
  mixins: [CommonMixin],
  components: {
    LineChart,
    EventGroupReader
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
      },
      collection: {
        render: false,
        update: {
          data: false,
          options: false
        }
      }
    }
  },
  computed: {
    ...mapGetters('db', [devReports, devEvents]),
    collectionField: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    eventGroup() {
      return this.collectionField === 'eventsGroup' && this.devEvents.length > 0
    },
    rangeSample() {
      let { xiMin, xiMax } = this.findRange(this.range.value)
      return xiMax - xiMin + 1
    }
  },
  methods: {
    getLabel(index) {
      let { labels } = this.chart.data

      if (index >= 0) return labels[index]
      return labels[labels.length - 1]
    },
    findRange({ min, max }) {
      let { labels } = this.chart.data

      // find the index
      let xiMin = min ? labels.findIndex((val) => val >= min) : 0
      let xiMax = max
        ? this.$_.findLastIndex(labels, (val) => val <= max)
        : labels.length - 1

      return { xiMin, xiMax }
    },
    findRangeX({ xiMin, xiMax }) {
      let { labels } = this.chart.data

      // calculate x-axes
      let xMin = labels[xiMin]
      let xMax = labels[xiMax]

      return { xMin, xMax }
    },
    findRangeY({ xiMin, xiMax }) {
      let { data } = this.chart.data.datasets[0]

      // calculate y-axes
      let scope = data.filter((_, i) => i >= xiMin && i <= xiMax)
      let yMin = this.$_.min(scope)
      let yMax = this.$_.max(scope)

      // correction
      if (this.control.beginAtZero) {
        if (yMin > 0) yMin = 0
        else yMax = 0
      }
      if (yMax == yMin) {
        if (yMin >= 0) yMax += 1
        else yMin -= 1
      }

      return { yMin, yMax }
    },
    applyRange(sample) {
      let { xiMin, xiMax } = this.findRange(this.range.value)
      let { xMax } = this.findRangeX({ xiMin, xiMax })
      let oldSample = xiMax - xiMin

      if (this.control.maximize || this.control.follow) {
        xiMax = this.chart.data.labels.length - 1
        xMax = this.getLabel(xiMax)

        if (this.control.maximize) xiMin = 0
      }

      if (!sample) {
        sample = xiMax - xiMin

        if (this.control.drag) {
          sample = oldSample

          if (!this.control.follow) xMax = this.getLabel(xiMin + sample)
        }
      } else sample--

      this.range.value = {
        min: this.getLabel(xiMax - sample),
        max: xMax
      }
    },
    scaleChart() {
      let { xiMin, xiMax } = this.findRange({ min, max })
      let { xMin, xMax } = this.findRangeX({ xiMin, xiMax })
      let { yMin, yMax } = this.findRangeY({ xiMin, xiMax })

      this.currentValue = xMax
      this.chart.options.scales.xAxes[0].ticks.max = xMax
      this.chart.options.scales.xAxes[0].ticks.min = xMin
      this.chart.options.scales.yAxes[0].ticks.max = yMax
      this.chart.options.scales.yAxes[0].ticks.min = yMin
      this.chart.options.scales.yAxes[0].ticks.beginAtZero = this.control.beginAtZero

      this.collection.update.options = !this.collection.update.options
      this.$nextTick(() => (this.modalOpen = true))
    },
    grabLabelsAndDatasets(reports) {
      let datasets = []
      let labels = []

      reports.forEach((report) => {
        if (report[this.collectionField]) {
          console.warn(report)
          datasets.push(report[this.collectionField].val)
          labels.push(report.logDatetime.val)
        }
      })
      console.error(reports)

      return {
        datasets: datasets.reverse(),
        labels: labels.reverse()
      }
    },
    writeChart(reports) {
      let { labels, datasets } = this.grabLabelsAndDatasets(reports)

      if (reports.length > 1) {
        this.chart.data.labels = labels
        this.chart.data.datasets[0].data = datasets
      } else {
        this.chart.data.labels.push(labels[0])
        this.chart.data.datasets[0].data.push(datasets[0])
      }
      this.range.min = this.getLabel(0)
      this.range.max = this.getLabel(-1)

      this.collection.update.data = !this.collection.update.data
    },
    prepareChart() {
      let { title, unit } = getField(Report, this.collectionField)

      this.chart.data.datasets[0].label = title
      this.chart.options.scales.yAxes[0].scaleLabel.labelString =
        unit || 'Value'

      this.collection.update.options = !this.collection.update.options
    },
    stopRender() {
      this.collection.render = false
      this.collectionField = null
    },
    changeColor(color) {
      this.chart.options.legend.labels.fontColor = color
      this.chart.options.scales.xAxes[0].ticks.fontColor = color
      this.chart.options.scales.xAxes[0].scaleLabel.fontColor = color
      this.chart.options.scales.xAxes[0].gridLines.color = color
      this.chart.options.scales.yAxes[0].ticks.fontColor = color
      this.chart.options.scales.yAxes[0].scaleLabel.fontColor = color
      this.chart.options.scales.yAxes[0].gridLines.color = color
    }
  },
  watch: {
    collectionField: {
      handler(field) {
        if (field) {
          this.prepareChart()
          this.writeChart(this.devReports)
          this.applyRange()
        }
      }
    },
    devReports: {
      handler(reports) {
        if (this.collection.render) {
          let report = reports[0]
          if (report[this.collectionField]) {
            this.writeChart([report])
            this.applyRange()
          }
        }
      }
    },
    'control.maximize': {
      immediate: true,
      handler(max) {
        let sample = null
        if (max) {
          this.tmp.max = this.range.value.max
          this.tmp.sample = this.rangeSample
          this.tmp.drag = this.control.drag
          this.tmp.follow = this.control.follow
          this.range.disable = true

          this.control.follow = false
          this.control.drag = false
        } else {
          this.range.disable = false
          this.control.follow = this.tmp.follow
          this.control.drag = this.tmp.drag
          this.range.value.max = this.tmp.max
          sample = this.tmp.sample
        }
        this.applyRange(sample)
      }
    },
    'range.value': {
      deep: true,
      handler(_) {
        this.scaleChart()
      }
    },
    'control.beginAtZero': {
      handler(_) {
        this.scaleChart()
      }
    },
    darker: {
      immediate: true,
      handler(dark) {
        this.changeColor(dark ? '#FFF' : '#666')
        this.collection.update.options = !this.collection.update.options
      }
    }
  }
}
</script>

<style></style>
