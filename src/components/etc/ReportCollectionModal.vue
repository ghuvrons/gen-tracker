<template>
  <q-modal
    v-model="modalOpen"
    @show="collection.render = true"
    @hide="stopRender()"
    :content-css="{ minWidth: '90vw', minHeight: '95vh' }"
  >
    <q-modal-layout>
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
        <div class="row gutter-sm justify-between">
          <div
            :class="
              collectionData.field === 'eventsGroup'
                ? 'col-sm-12 col-md-7 col-lg-8'
                : 'col-12'
            "
          >
            <line-chart
              :styles="{
                height: (height < 200 ? 200 : height) + 'px',
              }"
              :param="chart"
              :update="collection.update"
            />
            <q-range
              v-model="range.value"
              :min="sample.min"
              :max="sample.max"
              :disable="range.disable"
              :drag-range="control.drag"
              label
              snap
              square
              label-always
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
                  :value="range.sample"
                  type="number"
                  class="q-ma-xs"
                  style="width: 130px"
                  prefix="Sample :"
                  inverted
                  align="right"
                  disable
                />
              </div>
            </div>
          </div>

          <div
            v-if="collectionData.field === 'eventsGroup'"
            class="col-sm-12 col-md-5 col-lg-4"
          >
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
import { devReports } from '../../store/db/getter-types'
import { mapGetters } from 'vuex'
import { getField } from 'components/js/utils'
import { chart } from 'components/js/opt/config'
import { cloneDeep } from 'lodash'
import LineChart from 'components/etc/LineChart'
import EventGroupReader from 'components/etc/EventGroupReader'

export default {
  // name: 'ComponentName',
  components: {
    LineChart,
    EventGroupReader
  },
  props: {
    value: {
      required: true
    },
    height: Number
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
      sample: {
        min: 0,
        max: null
      },
      range: {
        disable: false,
        sample: 10,
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
    ...mapGetters('db', [devReports]),
    collectionData: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    getLabel(index) {
      return this.chart.data.labels[index]
    },
    grabLabelsAndDatasets() {
      let datasets = []
      let labels = []

      this.devReports.forEach(({ data }) => {
        let field = data.find(
          ({ field }) => field === this.collectionData.field
        )

        if (field) {
          datasets.push(field.value)
          labels.push(getField(data, 'logDatetime'))
        }
      })

      return {
        datasets: datasets.reverse(),
        labels: labels.reverse()
      }
    },
    findRange({ min, max }) {
      let { data } = this.chart.data.datasets[0]
      let { labels } = this.chart.data

      // find the index
      let xiMin = min ? labels.findIndex((val) => val >= min) : 0
      let xiMax = max
        ? this.$_.findLastIndex(labels, (val) => val <= max)
        : labels.length - 1

      let scope = data.filter((_, i) => i >= xiMin && i <= xiMax)

      // calculate x-axes
      let xMin = labels[xiMin]
      let xMax = labels[xiMax]

      // calculate y-axes
      let yMin = this.$_.min(scope)
      let yMax = this.$_.max(scope)

      // correction
      if (yMin > 0 && this.control.beginAtZero) yMin = 0
      if (yMax == yMin) yMax += 1

      return { xMin, xMax, yMin, yMax, xiMin, xiMax }
    },
    applyRange({ sample }) {
      let { xiMin, xiMax, xMax } = this.findRange(this.range.value)
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
      }

      this.range.value = {
        min: this.getLabel(xiMax - sample),
        max: xMax
      }
    },
    scaleChart() {
      let { xMin, xMax, yMin, yMax } = this.findRange(this.range.value)

      this.currentValue = xMax
      this.chart.options.scales.xAxes[0].ticks.max = xMax
      this.chart.options.scales.xAxes[0].ticks.min = xMin
      this.chart.options.scales.yAxes[0].ticks.max = yMax
      this.chart.options.scales.yAxes[0].ticks.min = yMin
      this.chart.options.scales.yAxes[0].ticks.beginAtZero = this.control.beginAtZero

      this.collection.update.options = !this.collection.update.options
      this.$nextTick(() => (this.modalOpen = true))
    },
    writeChart() {
      let { labels, datasets } = this.grabLabelsAndDatasets()

      this.chart.data.labels = labels
      this.chart.data.datasets[0].data = datasets

      this.sample.min = this.$_.min(labels)
      this.sample.max = this.$_.max(labels)

      this.collection.update.data = !this.collection.update.data
    },
    prepareChart() {
      let { title, unit } = this.collectionData

      this.chart.data.datasets[0].label = title
      this.chart.options.scales.yAxes[0].scaleLabel.labelString =
        unit || 'Value'

      this.collection.update.options = !this.collection.update.options
    },
    stopRender() {
      this.collection.render = false
      this.collectionData = null
    }
  },
  watch: {
    collectionData: {
      handler(data) {
        if (data && data.chartable && this.devReports.length > 1) {
          this.prepareChart()
          this.writeChart()
          this.applyRange({})
        }
      }
    },
    devReports: {
      handler(_) {
        if (this.collection.render) {
          this.writeChart()
          this.applyRange({})
        }
      }
    },
    'control.maximize': {
      handler(max) {
        let sample = null
        if (max) {
          // save
          this.tmp.max = this.range.value.max
          this.tmp.sample = this.range.sample
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
        this.applyRange({ sample })
      }
    },
    'range.value': {
      deep: true,
      handler(_) {
        let { xiMin, xiMax } = this.findRange(this.range.value)
        this.range.sample = xiMax - xiMin + 1
        this.scaleChart()
      }
    },
    'control.beginAtZero': {
      handler(_) {
        this.scaleChart()
      }
    }
  }
}
</script>

<style></style>
