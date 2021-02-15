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
          <span v-if="node.data">: {{ node.data.out }} {{ node.data.unit }}</span>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script>
import { get, set, omit } from "lodash";

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
      return this.report ? this.toTree(this.groupNodes()) : [];
    },
  },
  methods: {
    getFieldNodeTitle(field) {
      let theField = this.report[field];
      if (theField) {
        let group = theField.group.split(".");
        return this.removeWords(theField.title, group);
      }
      return field.toUpperCase();
    },
    removeWords(str, arr) {
      return arr.reduce((acc, val) => {
        const regex = new RegExp(val, "gi");
        return acc.replace(regex, "");
      }, str);
    },
    groupNodes() {
      let report = omit(this.report, "hex");

      return Object.keys(report).reduce((o, field) => {
        let { group } = report[field];
        let content = { [field]: report[field] };
        let grp = get(o, group);

        if (grp) content = { ...grp, ...content };
        return set(o, group, content);
      }, {});
    },
    toTree(nodes) {
      return Object.keys(nodes).map((label) => {
        return nodes[label].hasOwnProperty("out")
          ? { label, data: nodes[label] }
          : { label, children: this.toTree(nodes[label]) };
      });
    },
  },
};
</script>

<style>
</style>