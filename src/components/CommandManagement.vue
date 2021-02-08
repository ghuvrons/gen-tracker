<template>
  <div>
    <q-bar class="bg-blue text-white">
      <q-toolbar-title class="text-subtitle1">Command Management</q-toolbar-title>
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
        v-model="cmdBuffer"
        @keyup.enter="execCommand()"
        label="Input Command:"
        hint="Press ENTER to send."
        type="text"
        stack-label
        :dark="darker"
        :disable="loading || !device"
        :readonly="loading"
        :loading="loading"
      >
        <template v-slot:append>
          <q-icon name="send" class="cursor-pointer" @click="execCommand()"></q-icon>
        </template>
      </q-input>
    </div>

    <command-list-modal v-model="modalOpen" @select="selectCommand"></command-list-modal>
  </div>
</template>

<script>
import { COMMAND_LIST } from "components/js/command";
import { SET_BUFFER } from "src/store/db/mutation-types";
import { mapState, mapMutations } from "vuex";
import CommandListModal from "components/etc/CommandListModal";
import CommonMixin from "components/mixins/CommonMixin";
import { cloneDeep } from "lodash";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  components: {
    CommandListModal,
  },
  data() {
    return {
      COMMAND_LIST: cloneDeep(COMMAND_LIST),
      modalOpen: false,
    };
  },
  computed: {
    ...mapState("db", ["device", "buffer"]),
    cmdBuffer: {
      get() {
        return this.buffer;
      },
      set(value) {
        this.SET_BUFFER(value.toUpperCase());
      },
    },
  },
  methods: {
    ...mapMutations("db", [SET_BUFFER]),
    selectCommand(payload) {
      this.modalOpen = false;
      this.SET_BUFFER(payload);
    },
    execCommand() {
      this.$root.$emit("executeCommand", this.cmdBuffer);
    },
  },
};
</script>

<style></style>
