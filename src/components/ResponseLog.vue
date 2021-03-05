<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Response Log
        <q-badge v-if="devCommands.length > 0" color="red" align="top">
          {{ devCommands.length }}
        </q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-banner v-if="devCommands.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No response yet
    </q-banner>
    <q-virtual-scroll v-else :items="devCommands" :style="height" separator>
      <template v-slot="{ item: cmd, index }">
        <q-item :key="index" @click="writeCommand(cmd.payload)" clickable>
          <q-item-section>
            <q-item-label lines="1">{{ cmd.payload }}</q-item-label>
            <!-- <q-item-label lines="2" caption> -->
            {{ awaitCommand(cmd) ? "Waitting..." : parseMessage(cmd.message) }}
            <!-- </q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-icon
              v-if="awaitCommand(cmd)"
              @click="ignoreResponse()"
              color="yellow"
              name="cached"
            >
              <q-tooltip anchor="center left" self="center right">
                Cancel
              </q-tooltip>
            </q-icon>
            <q-icon
              v-else
              :color="parseResCode(cmd.resCode).color"
              :name="parseResCode(cmd.resCode).icon"
            >
              <q-tooltip anchor="center left" self="center right">
                {{ parseResCode(cmd.resCode).name }}
              </q-tooltip>
            </q-icon>
            <!-- <q-chip :color="readColor(cmd.resCode)" dark dense square>
              {{ readIcon(cmd.resCode) }}
            </q-chip> -->
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { parseResCode, parseMessage } from "src/js/response";
import { awaitCommand } from "src/js/command";

import { inject } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  emits: ["select"],
  props: {
    height: {
      required: true
    }
  },
  setup(props, { emit }) {
    const ignoreResponse = inject("ignoreResponse");

    const { devCommands } = useGetters(["devCommands"]);

    const writeCommand = payload => emit("select", payload);

    return {
      devCommands,

      awaitCommand,
      ignoreResponse,
      writeCommand,
      parseResCode,
      parseMessage
    };
  }
};
</script>

<style>
</style>
