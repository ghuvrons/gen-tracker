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
import { set, omit } from "lodash";

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
      return this.report ? this.toArrayTree(this.groupNodes()) : [];
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
    groupBy(report) {
      return Object.keys(report).reduce((acc, field) => {
        let theField = report[field];
        let { group } = theField;

        let content = [{ ...theField, field }];
        if (acc[group]) content = [...acc[group], ...content];

        return {
          ...acc,
          [group]: content,
        };
      }, {});
    },
    groupNodes() {
      let group = this.groupBy(omit(this.report, "hex"));

      return Object.keys(group).reduce(
        (o, key) =>
          set(
            o,
            key,
            group[key].reduce((c, el) => ({ ...c, [el.field]: el }), {})
          ),
        {}
      );
    },
    toArrayTree(nodes) {
      return Object.keys(nodes).map((key) => {
        return !nodes[key].hasOwnProperty("field")
          ? { label: key, children: this.toArrayTree(nodes[key]) }
          : {
              label: key,
              data: nodes[key],
            };
      });
    },
  },
};
</script>

<style>
</style>