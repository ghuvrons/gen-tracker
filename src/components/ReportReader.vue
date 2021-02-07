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
      <q-btn-group outline>
        <q-btn @click="tree = false" icon="list" :color="!tree ? 'primary' : ''" dense>
          <q-tooltip anchor="top middle" self="bottom middle">List</q-tooltip>
        </q-btn>
        <q-btn @click="tree = true" icon="account_tree" :color="tree ? 'primary' : ''" dense>
          <q-tooltip anchor="top middle" self="bottom middle">Tree</q-tooltip>
        </q-btn>
      </q-btn-group>
    </q-bar>

    <q-banner v-if="reportFields.length == 0" :dark="darker">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No active report yet
    </q-banner>
    <template v-else>
      <template v-if="tree">
        <q-input v-model="filter" label="Filter" :dark="darker" clearable dense></q-input>
        <q-scroll-area :style="`height: calc(100vh - ${height}px - 73px)`">
          <q-tree
            :selected.sync="selected"
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
                v-if="isDefined(prop.node.data)"
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
import { Report, lastFullReport } from "components/js/report";
import { devReports } from "../store/db/getter-types";
import { mapState, mapGetters } from "vuex";
import { getField, toArrayTree, removeWords } from "components/js/utils";
import { groupBy, set } from "lodash";
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
      tree: false,
      filter: "",
      selected: null,
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
    nodes() {
      if (Object.keys(this.theReportData).length == 0) return [];

      let group = groupBy(Report, "group");
      let tree = toArrayTree(
        Object.keys(groupBy(Report, "group")).reduce(
          (o, key) =>
            set(
              o,
              key,
              group[key].reduce((c, el) => ({ ...c, [el.field]: "" }), {})
            ),
          {}
        ),
        this.theReportData
      );

      return tree;
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
    isDefined(prop) {
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
      let theField = getField(Report, field);
      if (theField) return theField[subField];
      return field;
    },
    resetField() {
      this.historyField = null;
      this.selected = null;
    },
  },
  watch: {
    selected: function (field) {
      if (field) this.openHistory(field);
    },
  },
};
</script>

<style></style>
