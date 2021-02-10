<template>
  <div>
    <q-input v-model="filter" placeholder="Filter..." clearable filled dense></q-input>
    <div style="overflow-y:scroll" :style="height">
      <q-tree
        :selected="selected"
        @update:selected="$emit('update:selected', $event)"
        :nodes="nodes"
        :filter="filter"
        color="primary"
        node-key="label"
        default-expand-all
      >
        <template v-slot:default-header="{node}">
          <span class="text-weight-bold">{{ getFieldNodeTitle(node.label) }}</span>
          <span v-if="defined(node.data)">: {{ node.data }} {{ getSubField(node.label, 'unit') }}</span>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script>
import { Report } from "components/js/report";
import { getField, removeWords } from "components/js/utils";
import { groupReport } from "components/js/report";
import { toArrayTree } from "components/js/utils";

export default {
  emits: ["update:selected"],
  props: {
    report: {
      required: true,
    },
    selected: {
      required: true,
    },
    height: {
      required: true,
    },
  },
  data() {
    return {
      filter: "",
    };
  },
  computed: {
    nodes() {
      if (!this.report) return [];
      return toArrayTree(groupReport(), this.report);
    },
  },
  methods: {
    defined(prop) {
      return typeof prop !== "undefined";
    },
    getSubField(field, subField) {
      return getField(Report, field)[subField];
    },
    getFieldNodeTitle(field) {
      let theField = getField(Report, field);
      if (theField) {
        let group = theField.group.split(".");
        return removeWords(theField.title, group);
      }
      return field.toUpperCase();
    },
  },
};
</script>

<style>
</style>