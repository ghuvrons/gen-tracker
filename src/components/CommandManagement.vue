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
        @click="modal.open = true"
      ></q-btn>
    </p>
    <q-field
      class="q-pa-sm bg-white"
      helper="Press ENTER to send, or see the docs."
    >
      <q-input
        v-model="buffer"
        stack-label="Input Command:"
        upper-case
        type="text"
        :disable="loading || !theUnit"
        :readonly="loading"
        :loading="loading"
        @keyup.enter="executeCommand({ payload: buffer })"
        :after="[
          {
            icon: 'send',
            content: true,
            handler() {
              executeCommand({ payload: buffer });
            },
          },
        ]"
      />
    </q-field>

    <q-modal
      v-model="modal.open"
      :content-css="{ minWidth: '80vw', minHeight: '80vh' }"
    >
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />
          <q-toolbar-title>
            Command List
            <q-chip color="red" dense square>{{ COMMAND_LIST.length }}</q-chip>
          </q-toolbar-title>
        </q-toolbar>

        <q-toolbar slot="header">
          <q-search
            class="fit"
            inverted
            autofocus
            v-model="modal.search"
            color="none"
          />
        </q-toolbar>

        <q-toolbar slot="footer">
          <q-toolbar-title class="q-pa-xs">
            <q-btn color="primary" @click="modal.open = false" label="Close" />
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-list link separator>
            <q-item
              v-for="(el, i) in searchResult"
              :key="i"
              @click.native="selectCommand(el.command)"
            >
              <q-item-main>
                <q-item-tile label>{{ el.command }}</q-item-tile>
                <q-item-tile sublabel>{{ el.desc }}</q-item-tile>

                <q-item-tile sublabel>
                  <q-chip dense square color="red">
                    {{ el.command }}
                  </q-chip>
                </q-item-tile>
                <q-item-tile sublabel>
                  <q-chip dense square color="green">
                    {{ el.desc }}
                  </q-chip>
                </q-item-tile>
              </q-item-main>
              <q-item-side right v-if="el.type">
                <q-item-tile>
                  <q-chip dense square color="blue">{{ el.type }}</q-chip>
                </q-item-tile>
                <q-item-tile>
                  <q-chip dense square color="blue">{{ el.range }}</q-chip>
                </q-item-tile>
              </q-item-side>
            </q-item>
          </q-list>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import { FlowFilter } from 'components/js/helper'
import { readCommand, buildCommand } from 'components/js/parser'
import {
  Response,
  Command,
  COMMAND_LIST,
  RESPONSE_LIST
} from 'components/js/command'
import { mapState, mapMutations } from 'vuex'

export default {
  // name: 'ComponentName',
  created() {
    this.$root.$on('setCommand', this.setCommand)
    this.$root.$on('executeCommand', this.executeCommand)
  },
  destroyed() {
    this.$root.$off('setCommand', this.setCommand)
    this.$root.$off('executeCommand', this.executeCommand)
  },
  data() {
    return {
      COMMAND_LIST: this.$_.cloneDeep(COMMAND_LIST),
      buffer: '',
      modal: {
        open: false,
        height: 300,
        search: ''
      }
    }
  },
  computed: {
    ...mapState('database', ['loading', 'theUnit', 'theCommand']),
    searchResult() {
      return FlowFilter(COMMAND_LIST, this.modal.search)
    }
  },
  methods: {
    ...mapMutations('database', ['SET_THE_COMMAND']),
    setCommand(payload) {
      this.buffer = payload
    },
    selectCommand(payload) {
      this.modal.open = false
      this.setCommand(payload)
    },
    executeCommand({ payload }) {
      if (!payload) {
        this.$q.notify({ message: 'Empty payload.' })
        return
      }

      if (this.theCommand) {
        this.$q.notify({ message: 'Buffer full.' })
        return
      }

      if (!this.theUnit) {
        this.$q.notify({ message: 'No device.' })
        return
      }

      let cmd = readCommand(payload)
      if (!cmd.command) {
        this.$q.notify({ message: 'Unknown command.' })
        return
      }

      this.setCommand(payload)
      this.SET_THE_COMMAND({
        ...cmd,
        unitID: this.theUnit,
        hexData: buildCommand(cmd),
        payload
      })
    }
  }
}
</script>

<style></style>
