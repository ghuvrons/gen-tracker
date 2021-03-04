<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Command Management
      </q-toolbar-title>
      <q-btn
        v-if="COMMAND_LIST.length > 0"
        @click.native="modalOpen = true"
        color="primary"
        icon="info"
        dense
        push
        unelevated
      >
        <q-tooltip anchor="center left" self="center right">List</q-tooltip>
      </q-btn>
    </q-bar>

    <div class="q-pa-sm">
      <q-input
        v-model.lazy="payload"
        @keyup.enter="insertCommand(payload)"
        class="text-uppercase"
        label="Input Command:"
        hint="Press ENTER to send."
        type="text"
        stack-label
        :disable="processing || !devDevice"
        :readonly="processing"
        :loading="processing"
      >
        <template v-slot:append>
          <q-icon
            name="send"
            class="cursor-pointer"
            @click="insertCommand(payload)"
          ></q-icon>
        </template>
      </q-input>
    </div>

    <command-list-modal
      v-if="modalOpen"
      @close="modalOpen = false"
      @select="writeCommand"
    ></command-list-modal>
  </div>
</template>

<script>
import CommandListModal from "components/etc/CommandListModal";

import { COMMAND_LIST } from "src/js/command";
import { INSERT_COMMAND } from "src/store/db/action-types";

import { ref, computed } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useGetters, useActions } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  components: {
    CommandListModal
  },
  setup() {
    const { command } = useState(["command"]);
    const { devDevice } = useGetters(["devDevice"]);
    const { [INSERT_COMMAND]: insertCommand } = useActions([INSERT_COMMAND]);

    const modalOpen = ref(false);
    const payload = ref(null);

    const writeCommand = v => {
      payload.value = v;
      modalOpen.value = false;
    };

    return {
      COMMAND_LIST,
      modalOpen,

      payload,
      devDevice,

      writeCommand,
      insertCommand
    };
  }
};
</script>

<style></style>
