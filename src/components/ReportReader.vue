<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">Report Reader</q-toolbar-title>
      <q-btn
        @click="treeState = !treeState"
        :icon="treeState ? 'list' : 'account_tree'"
        color="primary"
        unelevated
        push
        dense
      >
        <q-tooltip anchor="center left" self="center right">{{
          treeState ? "List" : "Tree"
        }}</q-tooltip>
      </q-btn>
    </q-bar>

    <q-banner v-if="!theReport">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No active report yet
    </q-banner>
    <template v-else>
      <tree-report-reader
        v-if="treeState"
        :selected="field"
        @update:selected="open"
        :report="theReport"
        :height="hTree"
      ></tree-report-reader>
      <list-report-reader
        v-else
        :selected="field"
        @update:selected="open"
        :report="theReport"
        :height="hList"
      ></list-report-reader>
    </template>

    <report-history-modal
      v-if="field"
      :field="field"
      @close="reset()"
    ></report-history-modal>
  </div>
</template>

<script>
import ReportHistoryModal from "components/etc/ReportHistoryModal";
import { Report, lastFullReport, readReport } from "components/js/report";
import { SET_TREE } from "src/store/common/mutation-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import { getField, frameId } from "components/js/utils";
import { get } from "lodash";
import TreeReportReader from "components/etc/TreeReportReader";
import ListReportReader from "components/etc/ListReportReader";

export default {
  // name: 'ComponentName',
  props: {
    height: {
      required: true
    }
  },
  components: {
    ReportHistoryModal,
    TreeReportReader,
    ListReportReader
  },
  data() {
    return {
      field: null
    };
  },
  computed: {
    ...mapState("db", ["report"]),
    ...mapState("common", ["tree"]),
    ...mapGetters("db", ["devReports"]),
    treeState: {
      get() {
        return this.tree;
      },
      set(value) {
        this.SET_TREE(value);
      }
    },
    theReport() {
      if (!this.report) return;

      let report = readReport(this.report);
      if (this.report.frameId != frameId("FULL")) {
        let full = lastFullReport(this.report, this.devReports);

        if (full)
          report = {
            ...readReport(full),
            ...report
          };
      }

      return report;
    },
    hList() {
      return `height: calc(100vh - ${this.height}px - 34px)`;
    },
    hTree() {
      return ` height: calc(100vh - ${this.height}px - 73px)`;
    }
  },
  methods: {
    ...mapMutations("common", [SET_TREE]),
    open(field) {
      if (!field) return;

      let theField = getField(Report, field);
      if (!get(theField, "chartable")) return;

      let related = this.devReports.filter(({ [field]: _field }) => _field);
      if (related.length < 2) return;

      this.field = field;
    },
    reset() {
      this.field = null;
    }
  }
};
</script>

<style></style>
