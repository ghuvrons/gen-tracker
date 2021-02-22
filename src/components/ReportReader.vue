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
      @close="field = null"
    ></report-history-modal>
  </div>
</template>

<script>
import ReportHistoryModal from "components/etc/ReportHistoryModal";
import { Report, lastFullReport, readReport } from "components/js/report";
import { SET_TREE } from "src/store/common/mutation-types";
import { getField, frameId } from "components/js/utils";
import { get } from "lodash";
import TreeReportReader from "components/etc/TreeReportReader";
import ListReportReader from "components/etc/ListReportReader";

import { ref, computed } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

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
  setup(props) {
    const db = createNamespacedHelpers("db");
    const { report } = db.useState(["report"]);
    const { devReports } = db.useGetters(["devReports"]);

    const common = createNamespacedHelpers("common");
    const { tree } = common.useState(["tree"]);
    const { [SET_TREE]: setTree } = common.useMutations([SET_TREE]);

    const field = ref(null);

    const hList = computed(
      () => `height: calc(100vh - ${props.height}px - 34px)`
    );
    const hTree = computed(
      () => ` height: calc(100vh - ${props.height}px - 73px)`
    );
    const treeState = computed({
      get: () => tree.value,
      set: v => setTree(v)
    });
    const theReport = computed(() => {
      if (!report.value) return;

      let rpt = readReport(report.value);
      if (report.value.frameId != frameId("FULL")) {
        let full = lastFullReport(report.value, devReports.value);

        if (full)
          rpt = {
            ...readReport(full),
            ...rpt
          };
      }

      return rpt;
    });

    const open = fld => {
      if (!fld) return;

      let theField = getField(Report, fld);
      if (!get(theField, "chartable")) return;

      let related = devReports.value.filter(({ [fld]: _field }) => _field);
      if (related.length < 2) return;

      field.value = fld;
    };

    return {
      field,

      hList,
      hTree,
      treeState,
      theReport,

      open
    };
  }
};
</script>

<style></style>
