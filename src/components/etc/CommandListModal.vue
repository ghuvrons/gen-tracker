<template>
  <q-dialog
    v-model="modalOpen"
    :maximized="$q.screen.lt.md"
    full-width
    full-height
  >
    <q-layout view="Lhh lpR fff" :class="darkerClass" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>
            <span class="text-weight-bold">COMMAND LIST</span>
            <q-chip v-if="COMMAND_LIST.length > 0" dark dense square>
              {{ COMMAND_LIST.length }}
            </q-chip>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <q-virtual-scroll :items="searchResult" separator>
            <template v-slot="{ item: cmd, index }">
              <q-item
                :key="index"
                @click="$emit('select', cmd.command)"
                :dark="darker"
                clickable
              >
                <q-item-section>
                  <q-item-label lines="1">{{ cmd.command }}</q-item-label>
                  <q-item-label lines="2" caption>{{ cmd.desc }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="cmd.type" side>
                  <q-item-label lines="1">
                    <q-chip dark dense square color="red">
                      {{ cmd.type }}
                    </q-chip>
                  </q-item-label>
                  <q-item-label lines="2">
                    <q-chip dark dense square color="green">
                      {{ getRange(cmd.range) }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-virtual-scroll>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { COMMAND_LIST } from "components/js/command";
import { flowFilter } from "components/js/utils";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  emits: ["select"],
  props: {
    value: {
      required: true,
      type: Boolean,
    },
  },
  mixins: [CommonMixin],
  data() {
    return {
      COMMAND_LIST: this.$_.cloneDeep(COMMAND_LIST),
      keyword: "",
    };
  },
  computed: {
    modalOpen: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    searchResult() {
      return flowFilter(this.COMMAND_LIST, this.keyword);
    },
  },
  methods: {
    getRange(range) {
      const [min, max] = range;

      if (max) return `[ ${min}, ${max} ]`;
      return `[ ${min} ]`;
    },
  },
};
</script>

<style>
</style>