<template>
  <q-dialog
    :model-value="true"
    :maximized="$q.screen.lt.md"
    persistent
    full-width
    full-height
  >
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <template v-if="$q.screen.gt.xs">
            <q-toolbar-title>
              <span class="text-weight-bold">COMMAND LIST</span>
              <q-chip v-if="COMMAND_LIST.length > 0" dark dense square>
                {{ COMMAND_LIST.length }}
              </q-chip>
            </q-toolbar-title>
            <q-space></q-space>
          </template>
          <q-input
            v-model="keyword"
            placeholder="Filter..."
            :class="{ 'full-width': $q.screen.lt.sm }"
            dark
            clearable
            square
            outlined
            dense
          ></q-input>
          <!-- <q-space></q-space> -->
          <q-btn
            class="q-ml-sm"
            push
            round
            dense
            icon="close"
            @click="$emit('close')"
          />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" padding>
          <q-banner v-if="searchResults.length == 0">
            <template v-slot:avatar>
              <q-icon name="info"></q-icon>
            </template>
            No matching commands
          </q-banner>
          <q-virtual-scroll v-else :items="searchResults" separator>
            <template v-slot="{ item: cmd }">
              <q-item :key="cmd.command" @click="selectCommand(cmd)" clickable>
                <q-item-section>
                  <q-item-label lines="1">{{ cmd.command }}</q-item-label>
                  <q-item-label lines="2" caption>{{ cmd.desc }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="cmd.type" side>
                  <q-item-label lines="1">
                    <q-chip dark dense square color="grey">
                      {{ cmd.type }} [{{ cmd.size }}]
                    </q-chip>
                  </q-item-label>
                  <q-item-label v-if="cmd.range" lines="2">
                    <q-chip dark dense square color="primary">
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
import { COMMAND_LIST } from "src/js/command";
import { flowFilter } from "src/js/utils";

import { ref, computed, defineComponent } from "vue";

export default defineComponent({
  emits: ["close", "select"],
  setup(props, { emit }) {
    const keyword = ref("");

    const searchResults = computed(() =>
      flowFilter(COMMAND_LIST, keyword.value || "")
    );

    const getRange = ([min, max]) =>
      max ? `[ ${min}, ${max} ]` : `[ ${min} ]`;
    const selectCommand = ({ command }) => emit("select", command);

    return {
      COMMAND_LIST,
      keyword,

      searchResults,

      getRange,
      selectCommand
    };
  }
});
</script>

<style>
</style>
