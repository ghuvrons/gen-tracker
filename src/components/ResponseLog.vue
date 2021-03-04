<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Response Log
        <q-badge v-if="devCommands.length > 0" color="red" align="top">{{
          devCommands.length
        }}</q-badge>
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
        <q-item
          :key="index"
          @click="writeCommand(cmd)"
          :clickable="!processing"
        >
          <q-item-section>
            <q-item-label lines="1">{{ cmd.payload }}</q-item-label>
            <!-- <q-item-label lines="2" caption> -->
            {{ readMessage(cmd.message) }}
            <!-- </q-item-label> -->
          </q-item-section>

          <q-item-section @click="ignoreCommand(cmd)" side>
            <q-chip :color="readColor(cmd.resCode)" dark dense square>
              {{ readTitle(cmd.resCode) }}
            </q-chip>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { parseResCode, parseMessage } from "src/js/response";
import { INSERT_COMMAND, CANCEL_COMMAND } from "src/store/db/action-types";

import { get } from "lodash";
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
    const { devCommands } = useGetters(["devCommands"]);
    const {
      [INSERT_COMMAND]: insertCommand,
      [CANCEL_COMMAND]: cancelCommand
    } = useActions([INSERT_COMMAND, CANCEL_COMMAND]);

    const readMessage = message => parseMessage(message) || "Waitting";
    const readTitle = resCode => get(parseResCode(resCode), "title") || "WAIT";
    const readColor = resCode =>
      get(parseResCode(resCode), "color") || "yellow";

    const ignoreCommand = cmd =>
      cmd.hasOwnProperty("resCode") && cancelCommand();

    const writeCommand = ({ payload }) => {
      return; // FIXME
      insertCommand(payload);
    };

    return {
      devCommands,

      readMessage,
      readColor,
      readTitle,

      ignoreCommand,
      writeCommand,
      parseResCode,
      parseMessage
    };
  }
};
</script>

<style>
</style>
