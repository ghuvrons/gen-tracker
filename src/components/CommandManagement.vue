<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1"
        >Command Management</q-toolbar-title
      >
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
        @keyup.enter="execCommand()"
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
            @click="execCommand()"
          ></q-icon>
        </template>
      </q-input>
    </div>

    <command-list-modal
      v-model="modalOpen"
      @select="writeCommand"
    ></command-list-modal>
  </div>
</template>

<script>
import { COMMAND_LIST } from "components/js/command";
// import { mapState, mapGetters, mapActions } from "vuex";
import CommandListModal from "components/etc/CommandListModal";
import { INSERT_COMMAND } from "src/store/db/action-types";

import { reactive, toRefs, computed } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default {
  // name: 'ComponentName',
  components: {
    CommandListModal
  },
  setup() {
    const { useState, useGetters, useActions } = createNamespacedHelpers("db");
    const { command } = useState(["command"]);
    const { devDevice } = useGetters(["devDevice"]);
    const { [INSERT_COMMAND]: insertCommand } = useActions([INSERT_COMMAND]);

    const state = reactive({
      COMMAND_LIST,
      modalOpen: false
    });

    const payload = computed({
      get: () => command.value.payload,
      set: v => {
        insertCommand({ payload: v.toUpperCase(), exec: false });
      }
    });

    const writeCommand = v => (payload.value = v);
    const execCommand = () => insertCommand({ payload: payload.value });

    return {
      ...toRefs(state),

      payload,
      devDevice,

      writeCommand,
      execCommand
    };
  },
  // data() {
  //   return {
  //     COMMAND_LIST: cloneDeep(COMMAND_LIST),
  //     modalOpen: false,
  //   };
  // },
  computed: {
    // ...mapState("db", ["command"]),
    // ...mapGetters("db", [devDevice]),
    // payload: {
    //   get() {
    //     return this.command.payload;
    //   },
    //   set(value) {
    //     this.INSERT_COMMAND({ payload: value.toUpperCase(), exec: false });
    //   },
    // },
  },
  methods: {
    // ...mapActions("db", [INSERT_COMMAND]),
    // writeCommand(payload) {
    //   this.payload = payload;
    // },
    // execCommand() {
    //   this.INSERT_COMMAND({ payload: this.payload, exec: true });
    // },
  }
};
</script>

<style></style>
