<template>
  <div class="shadow-1" :class="darkerClass">
    <div class="q-pa-xs bg-purple text-white text-subtitle1">
      Report Reader
      <q-chip
        v-if="theReport"
        :color="fullFrame ? 'green' : 'light-green'"
        dark
        dense
        square
      >
        {{ fullFrame ? "FULL" : "SIMPLE" }}
      </q-chip>
    </div>

    <q-scroll-area :style="{ height: (height < 150 ? 150 : height) + 'px' }">
      <q-list v-if="theReport" :dark="darker" separator>
        <q-item
          v-for="field in reportFields"
          :key="field"
          @click="openHistory(field)"
          :clickable="readyHistory(field)"
          :focused="historyField == field"
          :dark="darker"
          manual-focus
        >
          <q-item-section>
            <q-item-label lines="1">
              {{ getSubField(field, "title") }}
            </q-item-label>
            <q-item-label lines="2" caption>
              {{ theReportData[field].out }}
              {{ getSubField(field, "unit") }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon
              :name="realtimeField(field) ? 'cloud_download' : 'cloud_off'"
              :color="realtimeField(field) ? 'green' : 'red'"
            >
            </q-icon>
          </q-item-section>
        </q-item>
      </q-list>

      <q-banner v-else :dark="darker">
        <template v-slot:avatar>
          <q-icon name="info"></q-icon>
        </template>
        No active report yet
      </q-banner>
    </q-scroll-area>

    <report-history-modal v-model="historyField" :height="height - 210">
    </report-history-modal>
  </div>
</template>

<script>
import ReportHistoryModal from 'components/etc/ReportHistoryModal'
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
    ReportHistoryModal
  },
  data() {
    return {
      historyField: null
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
    openHistory(field) {
      if (this.readyHistory(field)) this.historyField = field
    },
    readyHistory(field) {
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
