<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        Command Management
      </q-toolbar-title>
      <q-btn
        v-if="COMMAND_LIST.length > 0"
        @click="modalOpen = true"
        color="primary"
        icon="info"
        dense
        push
        unelevated
      >
        <q-tooltip v-if="$q.platform.is.desktop" anchor="center left" self="center right">List</q-tooltip>
      </q-btn>
    </q-bar>

    <div class="q-pa-sm">
      <q-input
        v-model="payload"
        @keyup.enter="sendCommand(payload)"
        :disable="!devDevice"
        class="text-uppercase"
        label="Input Command:"
        hint="Press ENTER to send."
        type="text"
        stack-label
      >
        <template v-slot:append>
          <q-icon
            name="send"
            class="cursor-pointer"
            @click="sendCommand(payload)"
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

import { ref, inject, computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  // name: 'ComponentName',
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      required: true
    }
  },
  components: {
    CommandListModal
  },
  setup(props, { emit }) {
    const sendCommand = inject("sendCommand");

    const store = useStore();
    const devDevice = computed(() => store.getters[`db/devDevice`]);

    const modalOpen = ref(false);

    const payload = computed({
      get: () => props.modelValue,
      set: (v) => emit("update:modelValue", v)
    });

    const writeCommand = (v) => {
      payload.value = v;
      modalOpen.value = false;
    };

    return {
      COMMAND_LIST,
      modalOpen,

      payload,
      devDevice,

      writeCommand,
      sendCommand
    };
  }
});
</script>

<style></style>
