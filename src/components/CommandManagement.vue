<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">Command Management
      <q-btn
        v-if="cmd.list.length"
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
        v-model="cmd.payload"
        stack-label="Input Command:"
        upper-case
        type="text"
        :disable="loading || !theUnit"
        :readonly="loading"
        :loading="loading"
        @keyup.enter="executeCommand({ payload: cmd.payload })"
        :after="[
          {
            icon: 'send',
            content: true,
            handler () {
              executeCommand({ payload: cmd.payload })
            }
          }
        ]"
      />
    </q-field>

    <q-modal
      v-model="modal.open"
      :content-css="{minWidth: '80vw', minHeight: '80vh'}"
    >
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="keyboard_arrow_left"
          />
          <q-toolbar-title>
            Command List
            <q-chip
              color="red"
              dense
              square
            >{{ cmd.list.length }}</q-chip>
          </q-toolbar-title>
        </q-toolbar>

        <q-toolbar slot="header">
          <q-search
            class="fit"
            inverted
            v-model="modal.search"
            color="none"
          />
        </q-toolbar>

        <q-toolbar slot="footer">
          <q-toolbar-title class="q-pa-xs">
            <q-btn
              color="primary"
              @click="modal.open = false"
              label="Close"
            />
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-list
            link
            separator
          >
            <q-item
              v-for="(el, i) in searchResult"
              :key="i"
              @click.native="selectCommandRefference(el.exCommand ? el.exCommand : el.command)"
            >
              <q-item-main>
                <q-item-tile label>{{el.command}}</q-item-tile>
                <q-item-tile sublabel>{{el.desc}}</q-item-tile>

                <q-item-tile sublabel>
                  <q-chip
                    dense
                    square
                    color="red"
                  >{{el.exCommand ? el.exCommand : el.command}}</q-chip>
                </q-item-tile>
                <q-item-tile sublabel>
                  <q-chip
                    dense
                    square
                    color="green"
                  >{{el.exDesc ? el.exDesc : el.desc}}</q-chip>
                </q-item-tile>
              </q-item-main>
              <q-item-side
                right
                v-if="el.type"
              >
                <q-item-tile>
                  <q-chip
                    dense
                    square
                    color="blue"
                  >{{el.type}}</q-chip>
                </q-item-tile>
                <q-item-tile>
                  <q-chip
                    dense
                    square
                    color="blue"
                  >{{el.range}}</q-chip>
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
import { Command, CommandList, CommandResponse, Response } from 'components/js/command'
import { mapState } from 'vuex'

export default {
  // name: 'ComponentName',
  created () {
    this.$root.$on('setCommand', this.setCommand)
    this.$root.$on('executeCommand', this.executeCommand)
    this.$root.$on('handleResponse', this.handleResponse)
  },
  destroyed () {
    this.$root.$off('setCommand', this.setCommand)
    this.$root.$off('executeCommand', this.executeCommand)
    this.$root.$off('handleResponse', this.handleResponse)
  },
  data () {
    return {
      cmd: {
        payload: '',
        list: this.$_.cloneDeep(CommandList)
      },
      modal: {
        open: false,
        height: 300,
        search: ''
      },
      dismiss: null,
      notifPosition: this.$q.platform.is.desktop ? 'bottom-right' : 'top-right'
    }
  },
  computed: {
    ...mapState('database', ['loading', 'theUnit', 'config']),
    searchResult () {
      return FlowFilter(this.cmd.list, this.modal.search)
    }
  },
  methods: {
    saveResponse (response) {
      // save command & response
      this.$store.commit('database/ADD_RESPONSES', response)
    },
    timeoutCommand () {
      let code = CommandResponse.find(el => el.name === 'timeout')
      // save response
      this.saveResponse({
        unitID: this.theUnit.unitID,
        data: null,
        hexData: null,
        command: this.cmd.payload,
        code,
        message: ''
      })
      // dismiss loading notifcation
      this.stopWaitting('Command timeout.', 'negative')
    },
    stopWaitting (message, type) {
      // hide any loading
      this.$store.commit('database/SET_LOADING', false)
      this.$q.loading.hide()
      this.dismiss()
      // stop timer
      if (this.timers.timeoutCommand.isRunning) {
        this.$timer.stop('timeoutCommand')
      }
      // show notification result
      this.$q.notify({
        message,
        type,
        position: this.notifPosition
      })
    },
    selectCommandRefference (payload) {
      this.modal.open = false
      this.setCommand(payload)
    },
    setCommand (payload) {
      this.cmd.payload = payload
    },
    buildCommand (refCommand, val) {
      let hex = ''

      Command.forEach((ele, i) => {
        let el = Command[Command.length - 1 - i]

        switch (el.field) {
          case 'value':
            hex = el.format(val) + hex
            break
          case 'subCode':
          case 'code':
            hex = el.format(refCommand[el.field]) + hex
            break
          case 'size':
            hex = el.format(hex) + hex
            break
          case 'crc':
            hex = el.format(hex) + hex
            break
          case 'prefix':
            hex = el.format() + hex
            break
          default:
            break
        }
      })

      return hex
    },
    executeCommand ({ payload, timeout }) {
      let message = null
      let refCommand = null
      let value = 0

      if (payload) {
        // split payload into property=value
        let prop = payload.split('=')
        let command = prop[0]
        // if has value
        if (prop.length > 1) {
          value = prop[1]
        }
        // find prop from command list
        refCommand = this.cmd.list.find(el => el.command === command)

        if (refCommand) {
          // prepare payload to send
          this.$store.commit('database/SET_LOADING', true)
          // timeout guard
          this.timers.timeoutCommand.time = timeout || this.config.command.timeoutMS
          this.$timer.start('timeoutCommand')
          // show notification about sending command
          this.dismiss = this.$q.notify({
            message: 'Sending command....',
            type: 'info',
            timeout: 0,
            position: this.notifPosition
          })
          // update command triggered by external components
          this.setCommand(payload)
          // send command
          this.$socket.emit('command', {
            client: this.theUnit.client,
            hexCommand: this.buildCommand(refCommand, value)
          })
        } else {
          message = 'Command is not registered'
        }
      } else {
        message = "Command can't be empty"
      }

      if (message) {
        this.$q.notify({
          message,
          type: 'warning',
          position: this.notifPosition
        })
      }
    },
    parseResponse (hexData) {
      let data = []
      let elCursor = 0
      // loop for each element
      Response.forEach(el => {
        let valFormat = el.format(hexData.substr(elCursor, el.size * 2))
        // update cursor position
        elCursor += (el.size * 2)
        // fill data
        data.push({
          ...el,
          value: valFormat,
          output: el.display(valFormat)
        })
      })

      let code = CommandResponse.find(el => {
        return el.code === data.find(el => el.field === 'code').value
      })

      return {
        unitID: data.find(el => el.field === 'unitID').value,
        data,
        hexData,
        command: this.cmd.payload,
        code,
        message: data.find(el => el.field === 'message').value
      }
    },
    handleResponse ({ hexData }) {
      let response = this.parseResponse(hexData)
      // save response
      this.saveResponse(response)
      // process the response
      this.processResponse(response)
      // dismiss loading notifcation
      this.stopWaitting('Command sent.', 'positive')
    },
    splitResponseMsg (message) {
      // breakdown the response message
      if (message.indexOf(':') > -1) {
        let cmd = message.split(':')[0]
        let res = message.split(':')[1]
        let prop = cmd
        let val = null

        // check is has value
        if (cmd.indexOf('=') > -1) {
          // response message has property and value
          prop = cmd.split('=')[0]
          val = cmd.split('=')[1]
        }

        return {
          cmd,
          res,
          prop,
          val
        }
      }

      return null
    },
    processResponse ({ message }) {
      // split response message
      let splittedMsg = this.splitResponseMsg(message)
      // process the splittedMsg response
      if (splittedMsg) {
        // check response
        if (splittedMsg.res === 'OK') {
          // check property
          if (splittedMsg.prop === 'FINGER_ADD') {
            this.$q
              .dialog({
                title: 'Add user',
                message: 'Name of fingerprint user.',
                preventClose: true,
                cancel: false,
                color: 'secondary',
                prompt: {
                  model: '',
                  type: 'text'
                }
              })
              .then(data => {
                this.$store.commit('database/ADD_FINGERS', {
                  unitID: this.theUnit.unitID,
                  fingerID: splittedMsg.val,
                  name: data
                })
              })
          } else if (splittedMsg.prop === 'FINGER_DEL') {
            this.$store.commit('database/DELETE_FINGERS', {
              unitID: this.theUnit.unitID,
              fingerID: splittedMsg.val
            })
          } else if (splittedMsg.prop === 'FINGER_RST') {
            this.$store.commit('database/RESET_FINGERS', {
              unitID: this.theUnit.unitID
            })
          }
        } else {
          this.$q.notify({
            message: `Command is ${splittedMsg.res}`,
            type: 'negative',
            position: this.notifPosition
          })
        }
      } else {
        // no command echo, ex: AT$INFO
      }
    }
  },
  timers: {
    timeoutCommand: { time: 0 }
  }
}
</script>

<style>
</style>
