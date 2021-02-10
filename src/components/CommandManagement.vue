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
        v-model="payload"
        @keyup.enter="execCommand()"
        label="Input Command:"
        hint="Press ENTER to send."
        type="text"
        stack-label
        :disable="loading || !devDevice"
        :readonly="loading"
        :loading="loading"
      >
        <template v-slot:append>
          <q-icon name="send" class="cursor-pointer" @click="execCommand()"></q-icon>
        </template>
      </q-input>
    </div>

    <command-list-modal v-model="modalOpen" @select="writeCommand"></command-list-modal>
  </div>
</template>

<script>
import { COMMAND_LIST } from "components/js/command";
import { SET_COMMAND } from "src/store/db/mutation-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import CommandListModal from "components/etc/CommandListModal";
import CommonMixin from "components/mixins/CommonMixin";
import { cloneDeep } from "lodash";
import { devDevice } from "src/store/db/getter-types";

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
    ...mapState("db", ["command"]),
    ...mapGetters("db", [devDevice]),
    payload: {
      get() {
        return this.command.payload;
      },
      set(value) {
        this.SET_COMMAND({ payload: value.toUpperCase(), exec: false });
      },
    },
  },
  methods: {
    ...mapMutations("db", [SET_COMMAND]),
    writeCommand(payload) {
      this.payload = payload;
    },
    execCommand() {
      this.SET_COMMAND({ payload: this.payload, exec: true });
    },
  },
};
</script>

<style></style>
