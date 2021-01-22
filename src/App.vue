<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { validPacket } from 'components/js/validator'
import { calibrateDeviceTime } from 'components/js/utils'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { uniqueReport } from './store/db/getter-types'
import {
  SET_LOADING,
  ADD_UNITS,
  ADD_REPORTS,
  ADD_COMMANDS,
  SET_THE_COMMAND,
  CLEAR_THE_COMMAND
} from './store/db/mutation-types'
import {
  parseReport,
  parseCmdResponse,
  readCommand,
  buildCommand
} from 'components/js/parser'

export default {
  name: 'App',
  created() {
    this.$root.$on('executeCommand', this.executeCommand)
    this.$root.$on('ignoreCommand', this.ignoreCommand)
  },
  destroyed() {
    this.$root.$off('executeCommand', this.executeCommand)
    this.$root.$off('ignoreCommand', this.ignoreCommand)
  },
  data() {
    return {
      dismiss: null
    }
  },
  computed: {
    ...mapState('db', ['theCommand', 'theUnit', 'timeCalibration']),
    ...mapGetters('db', [uniqueReport])
  },
  methods: {
    ...mapMutations('db', [
      SET_LOADING,
      ADD_UNITS,
      ADD_REPORTS,
      ADD_COMMANDS,
      SET_THE_COMMAND,
      CLEAR_THE_COMMAND
    ]),
    processPacket(hexData) {
      let header = validPacket(hexData)

      if (!header) {
        console.error(`CORRUPT ${hexData}`)
        return
      }

      let unitID = header.find(({ field }) => field === 'unitID').value
      let frameID = header.find(({ field }) => field === 'frameID').value
      let sequentialID = header.find(({ field }) => field === 'sequentialID')
        .value

      if (frameID === this.$config.frame.id.RESPONSE) {
        console.log(`RESPONSE-${sequentialID} ${hexData}`)
        this.handleResponse(hexData)
      } else if (this.uniqueReport(unitID, sequentialID)) {
        console.log(`REPORT-${sequentialID} ${hexData}`)
        this.handleReport(hexData)
      } else console.warn(`REPORT-${sequentialID} (DUPLICATE) ${hexData}`)

      this.ADD_UNITS(unitID)
    },

    handleReport(hexData) {
      let report = parseReport(hexData)
      this.ADD_REPORTS(report)
      this.hookReport(report)
    },

    hookReport(report) {
      if (this.timeCalibration)
        if (report.frameID === this.$config.frame.id.FULL) {
          let validTime = calibrateDeviceTime(report.data)
          if (validTime) {
            this.$root.$emit('executeCommand', `REPORT_RTC=${validTime}`)
            this.$q.notify({ message: 'Calibrating device time..' })
          }
        }
    },

    handleResponse(hexData) {
      let cmd = parseCmdResponse(this.theCommand, hexData)
      this.ADD_COMMANDS(cmd)
      this.hookResponse(cmd)
    },

    hookResponse(cmd) {
      this.stopWaitting('Command sent.', 'positive')

      if (cmd.resCode.title != 'OK') {
        this.$q.notify({
          message: `Command is ${cmd.resCode.title}`,
          type: 'negative'
        })
        return
      }

      this.$root.$emit('hookResponseFinger', cmd)
    },

    starWaitting() {
      this.timers.cmdTimeout.time =
        this.theCommand.timeout || this.$config.command.timeoutMS

      this.$timer.start('cmdTimeout')
      this.SET_LOADING(true)
      this.dismiss = this.$q.notify({
        message: 'Sending command....',
        timeout: 0
      })
    },
    stopWaitting(message, type) {
      this.dismiss()
      this.SET_LOADING(false)
      if (this.timers.cmdTimeout.isRunning) this.$timer.stop('cmdTimeout')

      this.CLEAR_THE_COMMAND()
      this.$q.notify({ message, type })
    },
    cmdTimeout() {
      this.ADD_COMMANDS(parseCmdResponse(this.theCommand, null))
      this.stopWaitting('Command timeout.', 'negative')
    },
    ignoreCommand() {
      this.stopWaitting('Command ignored.', 'warning')
    },

    executeCommand(payload) {
      if (!payload) {
        this.$q.notify({ message: 'Empty payload.' })
        return
      }

      if (this.theCommand) {
        this.$q.notify({ message: 'Command busy.' })
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

      this.SET_THE_COMMAND({
        ...cmd,
        unitID: this.theUnit,
        hexData: buildCommand(cmd),
        payload
      })
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
      let hexData = data.toString('hex').toUpperCase()
      this.processPacket(hexData)
    },
    'VCU/+/RPT': function (data, topic) {
      let hexData = data.toString('hex').toUpperCase()
      this.processPacket(hexData)
    }
  },
  watch: {
    theCommand: function (cmd) {
      if (cmd) {
        let { unitID, hexData } = cmd
        let binData = Buffer.from(hexData, 'hex')

        this.starWaitting()
        this.$mqtt.publish(`VCU/${unitID}/CMD`, binData)
      }
    }
  }
}
</script>

<style>
</style>
