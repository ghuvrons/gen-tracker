<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Response Log
        <q-badge v-if="devResponses.length > 0" color="red" align="top">{{
          devResponses.length
        }}</q-badge>
      </q-toolbar-title>
    </q-bar>

    <q-banner v-if="devResponses.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No response yet
    </q-banner>
    <q-virtual-scroll v-else :items="devResponses" :style="height" separator>
      <template v-slot="{ item: cmd, index }">
        <q-item
          :key="index"
          @click="writeCommand(cmd)"
          :clickable="!processing"
        >
          <q-item-section>
            <q-item-label lines="1">{{ cmd.payload }}</q-item-label>
            <!-- <q-item-label lines="2" caption> -->
            {{ parseMessage(cmd.message) }}
            <!-- </q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-chip
              :color="parseResCode(cmd.resCode).color"
              dark
              dense
              square
              >{{ parseResCode(cmd.resCode).title }}</q-chip
            >
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { parseResCode, parseMessage } from "src/js/response";
import { INSERT_COMMAND } from "src/store/db/action-types";

import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters, useActions } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  props: {
    height: {
      required: true
    }
  },
  setup(props) {
    const { devResponses } = useGetters(["devResponses"]);
    const { [INSERT_COMMAND]: insertCommand } = useActions([INSERT_COMMAND]);

    const writeCommand = ({ payload }) =>
      insertCommand({ payload, exec: false });

    return {
      devResponses,

      writeCommand,
      parseResCode,
      parseMessage
    };
  }
};
</script>

<style>
</style>
