<template>
    <q-page class="q-pa-xs">
        <!--
    we listen for size changes on this above
    <element>, so we place the observer as direct child:
  -->
        <q-resize-observable @resize="onResizePage" />
        <!--can be placed anywhere within your template -->
        <q-window-resize-observable @resize="onResize" />

        <map-management :height="mapHeight" :pageWidth="pageWidth">
        </map-management>

        <q-tabs v-model="selectedTab" inverted animated swipeable>
            <!-- Tabs - notice slot="title" -->
            <q-tab
                :count="selectedReports.length"
                slot="title"
                name="tab-1"
                label="Report Log"
            />
            <q-tab
                :count="selectedFingers.length"
                slot="title"
                name="tab-2"
                label="Driver Management"
            />
            <q-tab slot="title" name="tab-3" label="Configuration" />
            <!-- Targets -->
            <q-tab-pane name="tab-1">
                <report-log :height="paneHeight"></report-log>
            </q-tab-pane>
            <q-tab-pane name="tab-2">
                <driver-management :height="paneHeight"></driver-management>
            </q-tab-pane>
            <q-tab-pane name="tab-3">
                <global-configuration></global-configuration>
            </q-tab-pane>
        </q-tabs>
    </q-page>
</template>

<style></style>

<script>
import MapManagement from 'components/MapManagement'
import ReportLog from 'components/ReportLog'
import DriverManagement from 'components/DriverManagement'
import GlobalConfiguration from 'components/GlobalConfiguration'
import { config } from 'components/js/config'
import { CRC32, AsciiToHex } from 'components/js/helper'
import { Header } from 'components/js/frame'
import { mapGetters, mapState, mapMutations } from 'vuex'

export default {
  // name: 'PageIndex',
  components: {
    MapManagement,
    ReportLog,
    DriverManagement,
    GlobalConfiguration
  },
  data() {
    return {
      selectedTab: 'tab-1',
      mapHeight: 300,
      paneHeight: 0,
      pageWidth: 0
    }
  },
  computed: {
    ...mapState('database', [
      'config',
      'loading',
      'theCommand',
      'units',
      'combineCmd'
    ]),
    ...mapGetters('database', [
      'selectedReports',
      'selectedFingers',
      'uniqueReport'
    ])
  },
  methods: {
    ...mapMutations('database', ['ADD_UNITS']),
    onResize({ height }) {
      this.paneHeight = height - this.mapHeight - 180
    },
    onResizePage({ width }) {
      this.pageWidth = width
    },
    calculateCRC32(hexData) {
      // calculate size of crcHeader
      let crcSize = Header.filter(({ field }) =>
        ['prefix', 'crc'].includes(field)
      )
        .map(({ size }) => size)
        .reduce((sum, val) => sum + val)
      // calculate the crc
      return CRC32(hexData.substring(crcSize * 2))
    },
    validateFrame(hexData, header) {
      let valid = false
      // parse header
      let prefix = header.find(({ field }) => field === 'prefix')
      let crc = header.find(({ field }) => field === 'crc')
      let size = header.find(({ field }) => field === 'size')
      // valid report should be more than 8 chars

      // validate by prefix, crc and size
      if (prefix.value === this.config.frame.prefix) {
        // validate CRC
        if (crc.output === this.calculateCRC32(hexData)) {
          // validate Size
          let headerSize = prefix.size + crc.size + size.size
          if (size.value === hexData.length / 2 - headerSize) {
            // everything match, frame is valid
            valid = true
          } else {
            console.warn(`CORRUPT: Size not same`)
          }
        } else {
          console.warn(`CORRUPT: CRC not valid`)
        }
      } else {
        console.warn(`CORRUPT: Prefix not same`)
      }

      return valid
    },
    parseHeader(hexData) {
      // get header field for header and frame decision
      let elCursor = 0
      let header = []
      // parse frame by header
      Header.forEach((el) => {
        let valFormat = el.format(hexData.substr(elCursor, el.size * 2))
        // update cursor position
        elCursor += el.size * 2
        // fill data
        header.push({
          ...el,
          value: valFormat,
          output: el.display(valFormat)
        })
      })

      return header
    },
    showLoadingCommand() {
      let { timeout, cmd } = this.theCommand
      this.$root.$emit('waitCommand', timeout)
      // check is FINGER_ADD
      if (cmd.ref.command === 'FINGER_ADD') {
        this.$root.$emit('scanningDialog')
      }
    },
    processReceivedData(data) {
      let hexData = data.toString('hex').toUpperCase()
      let headerSize = Header.map(({ size }) => size).reduce(
        (sum, val) => sum + val
      )

      if (hexData.length < headerSize * 2) {
        console.warn(`CORRUPT: Bellow minimum size`)
        return
      }

      let header = this.parseHeader(hexData)
      if (!this.validateFrame(hexData, header)) {
        console.error(`CORRUPT ${hexData}`)
        return
      }

      let unitID = header.find(({ field }) => field === 'unitID').value
      let frameID = header.find(({ field }) => field === 'frameID').value
      let sequentialID = header.find(({ field }) => field === 'sequentialID')
        .value

      this.ADD_UNITS({ unitID })

      if (frameID === this.config.frame.id.RESPONSE) {
        console.log(`RESPONSE-${sequentialID} ${hexData}`)
        this.$root.$emit('handleResponse', { hexData })
      } else {
        // if duplicate discard
        if (this.uniqueReport(unitID, sequentialID)) {
          console.log(`REPORT-${sequentialID} ${hexData}`)
          this.$root.$emit('handleReport', {
            hexData,
            frameID
          })
        } else console.warn(`REPORT-${sequentialID} (DUPLICATE) ${hexData}`)
      }
    },
    sendCommand({ unitID, hex }) {
      let hexData = Buffer.from(hex, 'hex')
      this.$mqtt.publish(`VCU/${unitID}/CMD`, hexData)
    }
  },
  created() {
    this.$mqtt.subscribe('VCU/#')
  },
  mqtt: {
    'VCU/+/RSP': function (data, topic) {
      this.processReceivedData(data)
    },
    'VCU/+/RPT': function (data, topic) {
      this.processReceivedData(data)
    }
  },
  watch: {
    'theCommand.hex': function (hex) {
      if (hex) {
        this.sendCommand({
          unitID: this.theCommand.unitID,
          hex
        })

        // send command, wait response
        this.showLoadingCommand()
      }
    }
  }
}
</script>
