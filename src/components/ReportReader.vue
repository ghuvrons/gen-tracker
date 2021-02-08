<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Response Reader
        <q-badge
          v-if="theReport"
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
        <q-scroll-area :style="`height: calc(100vh - ${height}px - 73px)`">
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
        </q-scroll-area>
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
                {{ theReportData[field].out }}
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
      simple: [
        {
          label: "Satisfied customers (with avatar)",
          children: [
            {
              label: "Good food (with icon)",
              children: [
                { label: "Quality ingredients" },
                { label: "Good recipe" },
              ],
            },
            {
              label: "Good service (disabled node with icon)",
              children: [
                { label: "Prompt attention" },
                { label: "Professional waiter" },
              ],
            },
            {
              label: "Pleasant surroundings (with icon)",
              children: [
                {
                  label: "Happy atmosphere (with image)",
                },
                { label: "Good table presentation" },
                { label: "Pleasing decor" },
              ],
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapState("db", ["theReport", "tree"]),
    ...mapGetters("db", [devReports]),
    treeState: {
      get() {
        return this.tree;
      },
      set(value) {
        this.SET_TREE(value);
      },
    },
    theReportData() {
      let data = {
        ...lastFullReport(this.theReport, this.devReports),
        ...this.theReport,
      };
      if (Object.keys(data).length > 0) return data;
      return;
    },
    reportFields() {
      return Object.keys(omit(this.theReportData, "hex"));
    },
    fullFrame() {
      return this.theReport.frameID.val === this.$config.frame.id.FULL;
    },
    nodes() {
      if (!this.theReportData) return [];
      return toArrayTree(groupReport(), this.theReportData);
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
      return (
        this.theReport.frameID.val === this.$config.frame.id.FULL || required
      );
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
