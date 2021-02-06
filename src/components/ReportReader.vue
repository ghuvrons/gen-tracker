<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Response Reader
      </q-toolbar-title>
      <q-badge v-if="theReport" :color="fullFrame ? 'green' : 'light-green'">
        {{ fullFrame ? "FULL" : "SIMPLE" }}
      </q-badge>
    </q-bar>

    <q-virtual-scroll
      :items="reportFields"
      :style="`height: calc(100vh - ${height}px - 34px)`"
      separator
    >
      <template v-slot="{ item: field, index }">
        <q-item
          :key="field"
          @click="openHistory(field)"
          :clickable="hasHistory(field)"
          :active="historyField == field"
          active-class="bg-primary text-white"
          :dark="darker"
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
      </template>
      <template v-slot:after>
        <q-banner v-if="reportFields.length == 0" :dark="darker">
          <template v-slot:avatar>
            <q-icon name="info"></q-icon>
          </template>
          No active report yet
        </q-banner>
      </template>
    </q-virtual-scroll>

    <report-history-modal
      v-if="historyField"
      @close="historyField = null"
      :field="historyField"
    >
    </report-history-modal>
  </div>
</template>

<script>
import ReportHistoryModal from "components/etc/ReportHistoryModal";
import { Report, lastFullReport } from "components/js/report";
import { devReports } from "../store/db/getter-types";
import { mapState, mapGetters } from "vuex";
import { getField } from "components/js/utils";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  props: {
    height: {
      required: true,
    },
  },
  components: {
    ReportHistoryModal,
  },
  data() {
    return {
      historyField: null,
    };
  },
  computed: {
    ...mapState("db", ["theReport"]),
    ...mapGetters("db", [devReports]),
    theReportData() {
      return {
        ...lastFullReport(this.theReport, this.devReports),
        ...this.theReport,
      };
    },
    reportFields() {
      return Object.keys(this.$_.omit(this.theReportData, "hex"));
    },
    fullFrame() {
      return this.theReport.frameID.val === this.$config.frame.id.FULL;
    },
  },
  methods: {
    openHistory(field) {
      if (this.hasHistory(field)) this.historyField = field;
    },
    hasHistory(field) {
      let { chartable } = getField(Report, field);
      let related = this.devReports.filter(({ [field]: _field }) => _field);
      return chartable && related.length >= 2;
    },
    realtimeField(field) {
      let { required } = getField(Report, field);
      return (
        this.theReport.frameID.val === this.$config.frame.id.FULL || required
      );
    },
    getSubField(field, subField) {
      return getField(Report, field)[subField];
    },
  },
};
</script>

<style></style>
