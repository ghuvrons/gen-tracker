<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">
      Command Management
      <q-btn
        v-if="COMMAND_LIST.length > 0"
        icon="info"
        color="primary"
        dense
        round
        flat
        @click="modalOpen = true"
      ></q-btn>
    </p>
    <q-field
      class="q-pa-sm bg-white"
      helper="Press ENTER to send, or see the docs."
    >
      <q-input
        v-model="commandBuffer"
        stack-label="Input Command:"
        upper-case
        type="text"
        :disable="loading || !theUnit"
        :readonly="loading"
        :loading="loading"
        @keyup.enter="execCommand()"
        :after="[
          {
            icon: 'send',
            content: true,
            handler() {
              execCommand();
            },
          },
        ]"
      />
    </q-field>

    <command-list-modal
      v-model="modalOpen"
      @select="selectCommand"
    ></command-list-modal>
  </div>
</template>

<script>
import { COMMAND_LIST } from 'components/js/command'
import { SET_COMMAND_BUFFER } from '../store/db/mutation-types'
import { mapState, mapMutations } from 'vuex'
import CommandListModal from 'components/etc/CommandListModal.vue'

export default {
  // name: 'ComponentName',
  components: {
    CommandListModal
  },
  data() {
    return {
      COMMAND_LIST: this.$_.cloneDeep(COMMAND_LIST),
      modalOpen: false
    }
  },
  computed: {
    ...mapState('db', ['loading', 'theUnit', 'cmdBuffer']),
    commandBuffer: {
      get() {
        return this.cmdBuffer
      },
      set(value) {
        this.SET_COMMAND_BUFFER(value)
      }
    }
  },
  methods: {
    ...mapMutations('db', [SET_COMMAND_BUFFER]),
    selectCommand(payload) {
      this.modalOpen = false
      this.SET_COMMAND_BUFFER(payload)
    },
    execCommand() {
      this.$root.$emit('executeCommand', this.commandBuffer)
    }
  }
}
</script>

<style></style>
