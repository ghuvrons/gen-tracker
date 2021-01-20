<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { config } from 'components/js/config'
import { validPacket } from 'components/js/validator'
import { calibrateDeviceTime } from 'components/js/utils'
import { readCommand } from 'components/js/builder'
import { parseReport, parseCmdResponse } from 'components/js/parser'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'App',
  created() {
    this.$root.$on('ignoreCommand', this.ignoreCommand)
  },
  destroyed() {
    this.$root.$off('ignoreCommand', this.ignoreCommand)
  },
  data() {
    return {
      dismiss: null
    }
  },
  computed: {
    ...mapState('database', ['theCommand', 'timeCalibration']),
    ...mapGetters('database', ['uniqueReport'])
  },
  methods: {
    ...mapMutations('database', ['ADD_UNITS', 'ADD_REPORTS', 'ADD_COMMANDS']),
    ...mapMutations('database', [
      'SET_LOADING',
      'CLEAR_THE_COMMAND',
      'ADD_FINGERS',
      'DELETE_FINGERS',
      'RESET_FINGERS'
    ]),
    processPacket(data) {
      let hexData = data.toString('hex').toUpperCase()
      let header = validPacket(hexData)

      if (!header) {
        console.error(`CORRUPT ${hexData}`)
        return
      }

      let unitID = header.find(({ field }) => field === 'unitID').value
      let frameID = header.find(({ field }) => field === 'frameID').value
      let sequentialID = header.find(({ field }) => field === 'sequentialID')
        .value

      if (frameID === config.frame.id.RESPONSE) {
        console.log(`RESPONSE-${sequentialID} ${hexData}`)
        this.handleResponse(hexData)
      } else if (this.uniqueReport(unitID, sequentialID)) {
        console.log(`REPORT-${sequentialID} ${hexData}`)
        this.handleReport(hexData)
      } else console.warn(`REPORT-${sequentialID} (DUPLICATE) ${hexData}`)

      this.ADD_UNITS({ unitID })
    },
    handleReport(hexData) {
      let report = parseReport(hexData)
      this.ADD_REPORTS(report)

      if (this.timeCalibration)
        if (report.frameID === config.frame.id.FULL) {
          let validTime = calibrateDeviceTime(report.data)
          if (validTime) {
            let payload = `REPORT_RTC=${validTime}`
            this.$root.$emit('executeCommand', { payload })
            this.$q.notify({ message: 'Calibrating device time..' })
          }
        }
    },

    handleResponse(hexData) {
      let cmd = parseCmdResponse(this.theCommand, hexData)
      this.ADD_COMMANDS(cmd)
      this.processResponse(cmd)
      this.stopWaitting('Command sent.', 'positive')
    },

    processResponse({ resCode, payload, unitID }) {
      if (resCode.title != 'OK') {
        this.$q.notify({
          message: `Command is ${resCode.title}`,
          type: 'negative'
        })
        return
      }

      let cmd = readCommand(payload)
      switch (cmd.command) {
        case 'FINGER_ADD':
          this.$q
            .dialog({
              title: 'Add driver',
              message: 'Name of driver.',
              preventClose: true,
              cancel: false,
              color: 'secondary',
              prompt: {
                model: '',
                type: 'text'
              }
            })
            .then((data) => {
              this.ADD_FINGERS({
                unitID,
                fingerID: cmd.value,
                name: data
              })
            })
          break
        case 'FINGER_DEL':
          this.DELETE_FINGERS({
            unitID,
            fingerID: cmd.value
          })
          break
        case 'FINGER_RST':
          this.RESET_FINGERS({
            unitID
          })
          break

        default:
          break
      }
    },

    showLoader() {
      let { timeout, command } = this.theCommand
      this.waitCommand(timeout || config.command.timeoutMS)

      if (command == 'FINGER_ADD') this.$root.$emit('scanningDialog')
    },
    waitCommand(timeout) {
      this.SET_LOADING(true)

      this.timers.cmdTimeout.time = timeout
      this.$timer.start('cmdTimeout')

      this.dismiss = this.$q.notify({
        message: 'Sending command....',
        timeout: 0
      })
    },
    sendCommand({ unitID, hexData }) {
      this.$mqtt.publish(`VCU/${unitID}/CMD`, Buffer.from(hexData, 'hex'))
    },
    cmdTimeout() {
      this.ADD_COMMANDS(parseCmdResponse(this.theCommand))
      this.stopWaitting('Command timeout.', 'negative')
    },

    stopWaitting(message, type) {
      this.CLEAR_THE_COMMAND()

      this.SET_LOADING(false)
      this.$q.loading.hide()
      this.dismiss()

      if (this.timers.cmdTimeout.isRunning) this.$timer.stop('cmdTimeout')

      this.$q.notify({ message, type })
    },
    ignoreCommand() {
      if (this.timers.cmdTimeout.isRunning)
        this.stopWaitting('Command error.', 'warning')
    }
  },
  timers: {
    cmdTimeout: { time: 0 }
  },
  mounted() {
    this.$mqtt.subscribe('VCU/#')
  },
  mqtt: {
    'VCU/+/RSP': function (data, topic) {
      this.processPacket(data)
    },
    'VCU/+/RPT': function (data, topic) {
      this.processPacket(data)
    }
  },
  watch: {
    theCommand: function (cmd) {
      if (cmd) {
        this.sendCommand({ unitID: cmd.unitID, hexData: cmd.hexData })
        this.showLoader()
      }
    }
  }
}
</script>

<style>
</style>
