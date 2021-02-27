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
import { Report, readReport } from "src/js/report";
import { SET_TREE } from "src/store/common/mutation-types";
import { getField, frameId } from "src/js/utils";
import TreeReportReader from "components/etc/TreeReportReader";
import ListReportReader from "components/etc/ListReportReader";

import { ref, computed, watch, reactive, toRefs } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useGetters } = createNamespacedHelpers("db");

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
    const { report } = useState(["report"]);
    const { devDevice, devReports } = useGetters(["devDevice", "devReports"]);

    const common = createNamespacedHelpers("common");
    const { tree } = common.useState(["tree"]);
    const { [SET_TREE]: setTree } = common.useMutations([SET_TREE]);

    const field = ref(null);

    const treeState = computed({
      get: () => tree.value,
      set: v => setTree(v)
    });

    const open = target => {
      if (!target) return;

      let theField = getField(Report, target);
      if (!theField.hasOwnProperty("chartable")) return;

      let related = devReports.value.filter(({ [target]: _field }) => _field);
      if (related.length < 2) return;

      field.value = target;
    };

    const theReport = computed(() => {
      if (!report.value) return null;

      let data = readReport(report.value);
      if (frameId(data.frameID.val) != "FULL") {
        const { lastFullReport } = devDevice.value;

        if (lastFullReport)
          data = {
            ...readReport(lastFullReport),
            ...data
          };
      }

      return data;
    });

    const state = reactive({
      hList: 0,
      hTree: 0
    });
    watch(
      () => props.height,
      h => {
        state.hList = `height: calc(100vh - ${h}px - 34px)`;
        state.hTree = ` height: calc(100vh - ${h}px - 73px)`;
      },
      { lazy: false }
    );

    return {
      ...toRefs(state),
      field,
      theReport,

      treeState,
      theReport,

      open
    };
  }
};
</script>

<style></style>
