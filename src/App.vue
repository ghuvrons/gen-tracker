<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { validateFrame } from 'components/js/frame'
import { calibrateTime } from 'components/js/utils'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Field } from 'components/js/helper'
import { uniqueReport } from './store/db/getter-types'
import {
  SET_LOADING,
  ADD_UNITS,
  ADD_REPORTS,
  ADD_COMMANDS,
  SET_THE_COMMAND,
  CLEAR_THE_COMMAND
} from './store/db/mutation-types'
import { parseReport } from 'components/js/report'
import { parseResponse } from 'components/js/response'
import { parseCommand } from 'components/js/command'

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
    ...mapState('db', [
      'theCommand',
      'commands',
      'reports',
      'theUnit',
      'calibration'
    ]),
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
    handleFrame(hexData) {
      let header = validateFrame(hexData)
      if (!header) {
        console.error(`CORRUPT ${hexData}`)
        return
      }

      let { unitID, frameID, sequentialID } = Field(header, [
        'unitID',
        'frameID',
        'sequentialID'
      ])

      this.ADD_UNITS(unitID)
      if (frameID === this.$config.frame.id.RESPONSE) {
        console.log(`RESPONSE-${sequentialID} ${hexData}`)
        this.ADD_COMMANDS(parseResponse(this.theCommand, hexData))
      } else if (this.uniqueReport(unitID, sequentialID)) {
        console.log(`REPORT-${sequentialID} ${hexData}`)
        this.ADD_REPORTS(parseReport(hexData))
      } else console.warn(`REPORT-${sequentialID} (DUPLICATE) ${hexData}`)
    },

    starWaitting() {
      this.SET_LOADING(true)
      this.dismiss = this.$q.notify({
        message: 'Sending command....',
        timeout: 0
      })
      this.timers.cmdTimeout.time =
        this.theCommand.timeout || this.$config.command.timeoutMS
      this.$timer.start('cmdTimeout')
    },
    stopWaitting(message, type) {
      this.dismiss()
      this.CLEAR_THE_COMMAND()
      this.SET_LOADING(false)
      if (this.timers.cmdTimeout.isRunning) this.$timer.stop('cmdTimeout')

      this.$q.notify({ message, type })
    },

    cmdTimeout() {
      this.ADD_COMMANDS(parseResponse(this.theCommand, null))
      this.stopWaitting('Command timeout.', 'negative')
    },
    ignoreCommand() {
      this.stopWaitting('Command ignored.', 'warning')
    },

    invalidCommand(payload, cmd) {
      let error = null

      if (!payload) error = 'Empty payload.'
      else if (this.theCommand) error = 'Command busy.'
      else if (!this.theUnit) error = 'No device.'
      else if (!cmd.command) error = 'Unknown command.'

      return error
    },
    executeCommand(payload) {
      let cmd = parseCommand(payload)
      let error = invalidCommand(payload, cmd)

      if (error) {
        this.$q.notify({ message: error })
        return
      }

      this.SET_THE_COMMAND({
        ...cmd,
        unitID: this.theUnit,
        payload
      })
    }
  },
  mounted() {
    this.$mqtt.subscribe('VCU/#')
  },
  mqtt: {
    'VCU/+/RSP': function (data, topic) {
      let hexData = data.toString('hex').toUpperCase()
      this.handleFrame(hexData)
    },
    'VCU/+/RPT': function (data, topic) {
      let hexData = data.toString('hex').toUpperCase()
      this.handleFrame(hexData)
    }
  },
  timers: {
    cmdTimeout: { time: 0 }
  },
  watch: {
    theCommand: function (cmd) {
      if (cmd) {
        let { unitID, hexData } = cmd
        let binData = Buffer.from(hexData, 'hex')

        this.starWaitting()
        this.$mqtt.publish(`VCU/${unitID}/CMD`, binData)
      }
    },
    reports: function (reports) {
      if (reports.length > 0) {
        let { frameID, data } = reports[0]

        if (this.calibration)
          if (frameID === this.$config.frame.id.FULL) {
            let validTime = calibrateTime(data)
            if (validTime) {
              this.$root.$emit('executeCommand', `REPORT_RTC=${validTime}`)
              this.$q.notify({ message: 'Calibrating device time..' })
            }
          }
      }
    },
    commands: function (commands) {
      if (commands.length > 0) {
        let { resCode } = commands[0]
        let ok = resCode.title == 'OK'

        let message = ok ? 'Command sent.' : `Command is ${resCode.title}`
        let type = ok ? 'positive' : 'negative'

        this.stopWaitting(message, type)
      }
    }
  }
}
</script>

<style>
</style>
