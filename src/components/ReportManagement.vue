<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">Report Reader
      <q-chip
        color="negative"
        dense
        square
        v-if="theReport"
      >
        {{theReport.frameID === config.frame.id.FULL ? 'FULL' : 'SIMPLE'}}
      </q-chip>
    </p>

    <q-scroll-area
      class="bg-white"
      :style="{height: (height < 150 ? 150 : height) + 'px'}"
    >
      <q-list
        separator
        dense
        v-if="theReport"
      >
        <!-- the new required frame -->
        <q-item
          v-for="data in requiredReport"
          :link="selectedReports.length > 1 && data.chartable"
          :key="data.field"
          :class="{'bg-dark text-white': markField(data)}"
          @click.native="openReportStatistics(data)"
        >
          <q-item-main>
            <q-item-tile label>{{ data.title }}</q-item-tile>
            <q-item-tile
              sublabel
              :text-color="markField(data) ? 'yellow': null"
            >{{ data.output }}</q-item-tile>
          </q-item-main>
          <q-item-side
            right
            color="green"
            icon="cloud_download"
          />
        </q-item>
        <!-- add latest optional frame -->
        <q-item
          v-for="data in optionalReport"
          :link="selectedReports.length > 1 && data.chartable"
          :key="data.field"
          :class="{'bg-dark text-white': markField(data) }"
          @click.native="openReportStatistics(data)"
        >
          <q-item-main>
            <q-item-tile label>{{ data.title }}</q-item-tile>
            <q-item-tile sublabel>{{ data.output }}</q-item-tile>
          </q-item-main>
          <q-item-side
            right
            :color="theReport.frameID === config.frame.id.FULL ? 'green' : 'red'"
            :icon="theReport.frameID === config.frame.id.FULL ? 'cloud_download' : 'cloud_off'"
          />
        </q-item>
      </q-list>

      <q-alert
        v-else
        icon="info"
        color="faded"
        class="q-ma-xs"
      >
        No active report yet
      </q-alert>
    </q-scroll-area>

    <report-statistics
      :height="height - 210"
      :data="statisticsData"
      @close="closeReportStatistics()"
    >
    </report-statistics>
  </div>
</template>

<script>
import ReportStatistics from 'components/ReportStatistics'
import { Report } from 'components/js/frame'
import { mapState, mapGetters } from 'vuex'

export default {
  // name: 'ComponentName',
  created () {
    this.$root.$on('handleReport', this.handleReport)
  },
  destroyed () {
    this.$root.$off('handleReport', this.handleReport)
  },
  components: {
    ReportStatistics
  },
  props: {
    height: Number
  },
  data () {
    return {
      statisticsData: null
    }
  },
  computed: {
    ...mapState('database', ['theReport', 'config']),
    ...mapGetters('database', ['selectedReports']),
    requiredReport () {
      return this.theReport.data.filter(el => el.required)
    },
    optionalReport () {
      let lastOptional = []
      // find latest full report
      let lastFull = this.selectedReports.find(el => el.frameID === this.config.frame.id.FULL)
      if (lastFull) {
        lastOptional = lastFull.data.filter(el => !el.required)
      }

      return lastOptional
    }
  },
  methods: {
    openReportStatistics (data) {
      this.statisticsData = data
    },
    closeReportStatistics () {
      this.statisticsData = null
    },
    markField (data) {
      let marked = false
      if (this.statisticsData) {
        marked = data.field === this.statisticsData.field
      }

      return marked
    },
    parseReport ({ hexData, frameID }) {
      let data = []
      let elCursor = 0
      // loop for each element
      Report.forEach(el => {
        if (
          (frameID === this.config.frame.id.SIMPLE && el.required) ||
          frameID === this.config.frame.id.FULL
        ) {
          let valFormat = el.format(hexData.substr(elCursor, el.size * 2))
          // update cursor position
          elCursor += (el.size * 2)
          // fill data
          data.push({
            ...el,
            value: valFormat,
            output: el.display(valFormat)
          })
        }
      })

      return {
        unitID: data.find(el => el.field === 'unitID').value,
        frameID,
        data,
        hexData
      }
    },
    handleReport (prop) {
      this.$store.commit('database/ADD_REPORTS', this.parseReport(prop))
    }
  }
}
</script>

<style>
</style>
