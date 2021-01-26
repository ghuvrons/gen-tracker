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
        <q-item
          v-for="data in reportData"
          :link="devReports.length > 1 && data.chartable"
          :key="data.field"
          :class="{ 'bg-dark text-white': activeField(data) }"
          @click.native="collectionData = data"
        >
          <q-item-main>
            <q-item-tile label>{{ data.title }}</q-item-tile>
            <q-item-tile sublabel
              >{{ data.output }} {{ data.unit }}</q-item-tile
            >
          </q-item-main>
          <q-item-side
            right
            :color="realtimeField(data) ? 'green' : 'red'"
            :icon="realtimeField(data) ? 'cloud_download' : 'cloud_off'"
          />
        </q-item>
      </q-list>

      <q-alert v-else icon="info" color="faded" class="q-ma-xs">
        No active report yet
      </q-alert>
    </q-scroll-area>

    <report-collection-modal v-model="collectionData" :height="height - 210">
    </report-collection-modal>
  </div>
</template>

<script>
import ReportCollectionModal from 'components/etc/ReportCollectionModal'
import { reportData } from 'components/js/report'
import { devReports } from '../store/db/getter-types'
import { mapState, mapGetters } from 'vuex'

export default {
  // name: 'ComponentName',
  components: {
    ReportCollectionModal
  },
  props: {
    height: Number
  },
  data() {
    return {
      collectionData: null
    }
  },
  computed: {
    ...mapState('db', ['theReport']),
    ...mapGetters('db', [devReports]),
    reportData() {
      return reportData(this.theReport, this.devReports)
    }
  },
  methods: {
    activeField({ field }) {
      return this.collectionData && this.collectionData.field == field
    },
    realtimeField({ required }) {
      return this.theReport.frameID === this.$config.frame.id.FULL || required
    }
  }
}
</script>

<style></style>
