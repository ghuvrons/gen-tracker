<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">
      Report Reader
      <q-chip color="negative" dense square v-if="theReport">
        {{ theReport.frameID === $config.frame.id.FULL ? "FULL" : "SIMPLE" }}
      </q-chip>
    </p>

    <q-scroll-area
      class="bg-white"
      :style="{ height: (height < 150 ? 150 : height) + 'px' }"
    >
      <q-list separator dense v-if="theReport">
        <!-- the new required frame -->
        <q-item
          v-for="data in requiredReport"
          :link="devReports.length > 1 && data.chartable"
          :key="data.field"
          :class="{ 'bg-dark text-white': activeField(data) }"
          @click.native="openReportStatistics(data)"
        >
          <q-item-main>
            <q-item-tile label>{{ data.title }}</q-item-tile>
            <q-item-tile
              sublabel
              :text-color="activeField(data) ? 'yellow' : null"
              >{{ data.output }} {{ data.unit }}</q-item-tile
            >
          </q-item-main>
          <q-item-side right color="green" icon="cloud_download" />
        </q-item>
        <!-- add latest optional frame -->
        <q-item
          v-for="data in optionalReport"
          :link="devReports.length > 1 && data.chartable"
          :key="data.field"
          :class="{ 'bg-dark text-white': activeField(data) }"
          @click.native="openReportStatistics(data)"
        >
          <q-item-main>
            <q-item-tile label>{{ data.title }}</q-item-tile>
            <q-item-tile sublabel
              >{{ data.output }} {{ data.unit }}</q-item-tile
            >
          </q-item-main>
          <q-item-side
            right
            :color="
              theReport.frameID === $config.frame.id.FULL ? 'green' : 'red'
            "
            :icon="
              theReport.frameID === $config.frame.id.FULL
                ? 'cloud_download'
                : 'cloud_off'
            "
          />
        </q-item>
      </q-list>

      <q-alert v-else icon="info" color="faded" class="q-ma-xs">
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
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  // name: 'ComponentName',
  components: {
    ReportStatistics
  },
  props: {
    height: Number
  },
  data() {
    return {
      statisticsData: null
    }
  },
  computed: {
    ...mapState('database', ['theReport']),
    ...mapGetters('database', ['devReports']),
    requiredReport() {
      return this.theReport.data.filter(({ required }) => required)
    },
    optionalReport() {
      let nearestOptional = []

      // use nearest full frame
      let selectedIndex = this.devReports.findIndex(
        ({ hexData }) => hexData === this.theReport.hexData
      )
      for (let index = selectedIndex; index >= 0; index--) {
        if (this.devReports[index].frameID === this.$config.frame.id.FULL) {
          nearestOptional = this.devReports[index].data.filter(
            ({ required }) => !required
          )
          break
        }
      }

      return nearestOptional
    }
  },
  methods: {
    openReportStatistics(data) {
      this.statisticsData = data
    },
    closeReportStatistics() {
      this.statisticsData = null
    },
    activeField(data) {
      let active = false
      if (this.statisticsData) active = data.field === this.statisticsData.field

      return active
    }
  }
}
</script>

<style></style>
