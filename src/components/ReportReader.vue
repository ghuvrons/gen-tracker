<template>
  <div class="shadow-1" :class="darkerClass">
    <p class="q-pa-sm q-mb-none bg-purple text-white">
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
      <q-list v-if="theReport" separator dense :dark="darker">
        <q-item
          v-for="field in reportFields"
          :key="field"
          :link="readyCollection(field)"
          :active="collectionField == field"
          @click.native="openCollection(field)"
          :dark="darker"
        >
          <q-item-main>
            <q-item-tile label>{{ getSubField(field, "title") }}</q-item-tile>
            <q-item-tile sublabel
              >{{ theReportData[field].out }}
              {{ getSubField(field, "unit") }}</q-item-tile
            >
          </q-item-main>
          <q-item-side
            right
            :color="realtimeField(field) ? 'green' : 'red'"
            :icon="realtimeField(field) ? 'cloud_download' : 'cloud_off'"
          />
        </q-item>
      </q-list>

      <q-alert v-else icon="info" color="faded" class="q-ma-xs">
        No active report yet
      </q-alert>
    </q-scroll-area>

    <report-collection-modal v-model="collectionField" :height="height - 210">
    </report-collection-modal>
  </div>
</template>

<script>
import ReportCollectionModal from 'components/etc/ReportCollectionModal'
import { Report, lastFullReport } from 'components/js/report'
import { devReports } from '../store/db/getter-types'
import { mapState, mapGetters } from 'vuex'
import { getField } from 'components/js/utils'
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
      collectionField: null
    }
  },
  computed: {
    ...mapState('db', ['theReport']),
    ...mapGetters('db', [devReports]),
    theReportData() {
      return {
        ...lastFullReport(this.theReport, this.devReports),
        ...this.theReport
      }
    },
    reportFields() {
      return Object.keys(this.$_.omit(this.theReportData, 'hex'))
    },
    fullFrame() {
      return this.theReport.frameID.val === this.$config.frame.id.FULL
    }
  },
  methods: {
    openCollection(field) {
      if (this.readyCollection(field)) this.collectionField = field
    },
    readyCollection(field) {
      let { chartable } = getField(Report, field)

      let related = this.devReports.filter(({ [field]: _field }) => _field)
      return chartable && related.length >= 2
    },
    realtimeField(field) {
      let { required } = getField(Report, field)
      return (
        this.theReport.frameID.val === this.$config.frame.id.FULL || required
      )
    },
    getSubField(field, subField) {
      return getField(Report, field)[subField]
    }
  }
}
</script>

<style></style>
