<template>
  <div class="shadow-1" :class="darkerClass">
    <p class="q-pa-sm q-mb-none bg-purple text-white">
      Command Management
      <q-icon
        v-if="COMMAND_LIST.length > 0"
        @click.native="modalOpen = true"
        style="cursor: pointer"
        name="info"
      >
      </q-icon>
    </p>
    <q-field
      class="q-pa-sm"
      helper="Press ENTER to send, or see the docs."
      :dark="darker"
    >
      <q-input
        v-model="commandBuffer"
        stack-label="Input Command:"
        upper-case
        type="text"
        :dark="darker"
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
import { SET_THE_CMD_BUFFER } from '../store/db/mutation-types'
import { mapState, mapMutations } from 'vuex'
import CommandListModal from 'components/etc/CommandListModal'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
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
    ...mapState('db', ['theUnit', 'theCmdBuffer']),
    commandBuffer: {
      get() {
        return this.theCmdBuffer
      },
      set(value) {
        this.SET_THE_CMD_BUFFER(value)
      }
    }
  },
  methods: {
    ...mapMutations('db', [SET_THE_CMD_BUFFER]),
    selectCommand(payload) {
      this.modalOpen = false
      this.SET_THE_CMD_BUFFER(payload)
    },
    execCommand() {
      this.$root.$emit('executeCommand', this.commandBuffer)
    }
  }
}
</script>

<style></style>
