<template>
  <div>
    <q-input
      v-model="filter"
      placeholder="Search..."
      clearable
      filled
      dense
    ></q-input>
    <div style="overflow-y: scroll" :style="height">
      <q-tree
        :selected="selected"
        @update:selected="$emit('update:selected', $event)"
        :nodes="nodes"
        :filter="filter"
        color="primary"
        node-key="label"
        default-expand-all
      >
        <template v-slot:default-header="{ node }">
          <span class="text-weight-bold">
            {{ getFieldNodeTitle(node.label) }}
          </span>
          <span v-if="node.data">
            : {{ node.data.out }} {{ node.data.unit }}
          </span>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script>
import { get, set, omit } from "lodash";
import { ref, computed, defineComponent } from "vue";

export default defineComponent({
  emits: ["update:selected"],
  props: {
    report: {
      required: true
    },
    selected: {
      required: true
    },
    height: {
      required: true
    }
  },
  setup(props) {
    const filter = ref("");

    const removeWords = (str, arr) =>
      arr.reduce((acc, val) => {
        const regex = new RegExp(val, "gi");
        return acc.replace(regex, "");
      }, str);

    const getFieldNodeTitle = (field) => {
      const theField = props.report[field];
      if (theField) {
        const group = theField.group.split(".");
        return removeWords(theField.title, group);
      }
      return field.toUpperCase();
    };
    const groupNodes = () => {
      const report = omit(props.report, "hex");

      return Object.keys(report).reduce((o, field) => {
        const { group } = report[field];
        const grp = get(o, group);
        let content = { [field]: report[field] };

        if (grp) content = { ...grp, ...content };
        return set(o, group, content);
      }, {});
    };
    const toTree = (nodes) =>
      Object.keys(nodes).map((label) => {
        return nodes[label].hasOwnProperty("out")
          ? { label, data: nodes[label] }
          : { label, children: toTree(nodes[label]) };
      });

    const nodes = computed(() => (props.report ? toTree(groupNodes()) : []));

    return {
      filter,
      nodes,

      getFieldNodeTitle
    };
  }
});
</script>

<style>
</style>
