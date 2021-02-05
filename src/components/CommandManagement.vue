<template>
  <div class="shadow-1" :class="darkerClass">
    <div class="q-pa-xs bg-purple text-white text-subtitle1">
      Command Management
      <q-badge
        v-if="COMMAND_LIST.length > 0"
        @click.native="modalOpen = true"
        align="top"
        color="red"
      >
        <q-icon class="cursor-pointer" name="info"> </q-icon>
      </q-badge>
    </div>
    <div class="q-pa-sm">
      <q-input
        v-model="commandBuffer"
        @keyup.enter="execCommand()"
        label="Input Command:"
        hint="Press ENTER to send."
        type="text"
        stack-label
        :dark="darker"
        :disable="loading || !theUnit"
        :readonly="loading"
        :loading="loading"
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
        this.SET_THE_CMD_BUFFER(value.toUpperCase())
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
