<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Response Reader
        <q-badge
          v-if="report"
          :color="fullFrame ? 'green' : 'light-green'"
        >{{ fullFrame ? "FULL" : "SIMPLE" }}</q-badge>
      </q-toolbar-title>
      <q-btn
        @click="treeState = !treeState"
        :icon="treeState ? 'list' : 'account_tree'"
        color="primary"
        unelevated
        push
        dense
      >
        <q-tooltip anchor="center left" self="center right">{{treeState ? 'List' : 'Tree'}}</q-tooltip>
      </q-btn>
    </q-bar>

    <q-banner v-if="reportFields.length == 0" :dark="darker">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No active report yet
    </q-banner>
    <template v-else>
      <template v-if="treeState">
        <q-input v-model="filter" placeholder="Filter..." :dark="darker" clearable filled dense></q-input>
        <div :style="`overflow-y:scroll; max-height: calc(100vh - ${height}px - 73px)`">
          <q-tree
            :selected="historyField"
            @update:selected="openHistory"
            :nodes="nodes"
            :filter="filter"
            :dark="darker"
            color="primary"
            node-key="label"
            default-expand-all
          >
            <template v-slot:default-header="prop">
              <span class="text-weight-bold">{{ getFieldNodeTitle(prop.node.label) }}</span>
              <span
                v-if="defined(prop.node.data)"
              >: {{ prop.node.data }} {{ getSubField(prop.node.label, 'unit') }}</span>
            </template>
          </q-tree>
        </div>
      </template>
      <q-virtual-scroll
        v-else
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
              <q-item-label lines="1">{{ getSubField(field, "title") }}</q-item-label>
              <q-item-label lines="2" caption>
                {{ reportData[field].out }}
                {{ getSubField(field, 'unit') }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon
                :name="realtimeField(field) ? 'cloud_download' : 'cloud_off'"
                :color="realtimeField(field) ? 'green' : 'red'"
              ></q-icon>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
    </template>

    <report-history-modal v-if="historyField" @close="resetField()" :field="historyField"></report-history-modal>
  </div>
</template>

<script>
import ReportHistoryModal from "components/etc/ReportHistoryModal";
import { Report, lastFullReport, groupReport } from "components/js/report";
import { devReports } from "src/store/db/getter-types";
import { SET_TREE } from "src/store/db/mutation-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import { getField, toArrayTree, removeWords } from "components/js/utils";
import { omit } from "lodash";
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
      filter: "",
    };
  },
  computed: {
    ...mapState("db", ["report", "tree"]),
    ...mapGetters("db", [devReports]),
    treeState: {
      get() {
        return this.tree;
      },
      set(value) {
        this.SET_TREE(value);
      },
    },
    reportData() {
      let data = {
        ...lastFullReport(this.report, this.devReports),
        ...this.report,
      };
      if (Object.keys(data).length == 0) return;
      return data;
    },
    reportFields() {
      return Object.keys(omit(this.reportData, "hex"));
    },
    fullFrame() {
      return this.report.frameID.val === this.$config.frame.id.FULL;
    },
    nodes() {
      if (!this.reportData) return [];
      return toArrayTree(groupReport(), this.reportData);
    },
  },
  methods: {
    ...mapMutations("db", [SET_TREE]),
    openHistory(field) {
      if (field && this.hasHistory(field)) this.historyField = field;
    },
    hasHistory(field) {
      let theField = getField(Report, field);
      let related = this.devReports.filter(({ [field]: _field }) => _field);
      return theField && theField.chartable && related.length >= 2;
    },
    realtimeField(field) {
      let { required } = getField(Report, field);
      return this.report.frameID.val === this.$config.frame.id.FULL || required;
    },
    defined(prop) {
      return typeof prop !== "undefined";
    },
    getFieldNodeTitle(field) {
      let theField = getField(Report, field);
      if (theField) {
        let group = theField.group.split(".");
        return removeWords(theField.title, group);
      }
      return field.toUpperCase();
    },
    getSubField(field, subField) {
      return getField(Report, field)[subField];
    },
    resetField() {
      this.historyField = null;
      this.selected = null;
    },
  },
};
</script>

<style></style>
