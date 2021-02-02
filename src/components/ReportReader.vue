<template>
  <div class="shadow-1" :class="darkerClass">
    <p class="q-pa-sm q-mb-none bg-info text-white">
      Report Reader
      <q-chip
        :color="fullFrame ? 'green' : 'light-green'"
        dense
        square
        class="shadow-1"
        v-if="theReport"
      >
        {{ fullFrame ? "FULL" : "SIMPLE" }}
      </q-chip>
    </p>

    <q-scroll-area
      :class="darkerClass"
      :style="{ height: (height < 150 ? 150 : height) + 'px' }"
    >
      <q-list separator dense v-if="theReport" :dark="darker">
        <q-item
          v-for="data in reportData"
          :link="readyCollection(data)"
          :key="data.field"
          :active="activeCollectionField(data)"
          @click.native="openCollection(data)"
          :dark="darker"
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
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  mixins: [CommonMixin],
  components: {
    ReportCollectionModal
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
    },
    fullFrame() {
      return this.theReport.frameID === this.$config.frame.id.FULL
    }
  },
  methods: {
    readyCollection({ field, chartable }) {
      let related = this.devReports.filter(({ data }) => {
        return data.some(({ field: _field }) => _field == field)
      })
      return chartable && related.length >= 2
    },
    openCollection(data) {
      if (this.readyCollection(data)) this.collectionData = data
    },
    activeCollectionField({ field }) {
      return this.collectionData && this.collectionData.field == field
    },
    realtimeField({ required }) {
      return this.theReport.frameID === this.$config.frame.id.FULL || required
    }
  }
}
</script>

<style></style>
