<template>
  <q-page class="q-pa-xs">
    <!--
    we listen for size changes on this above
    <element>, so we place the observer as direct child:
  -->
    <q-resize-observable @resize="onResizePage" />
    <!--can be placed anywhere within your template -->
    <q-window-resize-observable @resize="onResize" />

    <map-management
      :height="mapHeight"
      :pageWidth="pageWidth"
    >
    </map-management>

    <q-tabs
      v-model="selectedTab"
      inverted
      animated
      swipeable
    >
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
      <q-tab
        slot="title"
        name="tab-3"
        label="Configuration"
      />
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
import { ACK } from 'components/js/ack'
import { Header } from 'components/js/frame'
import { mapGetters, mapState } from 'vuex'

export default {
  // name: 'PageIndex',
  components: {
    MapManagement,
    ReportLog,
    DriverManagement,
    GlobalConfiguration
  },
  data () {
    return {
      selectedTab: 'tab-1',
      mapHeight: 300,
      paneHeight: 0,
      pageWidth: 0
    }
  },
  computed: {
    ...mapState('database', ['config', 'loading', 'theCommand']),
    ...mapGetters('database', ['selectedReports', 'selectedFingers', 'uniqueReport'])
  },
  methods: {
    onResize ({ height }) {
      this.paneHeight = height - this.mapHeight - 180
    },
    onResizePage ({ width }) {
      this.pageWidth = width
    },
    calculateCRC32 (hexData) {
      // calculate size of crcHeader
      let crcSize = Header
        .filter(el => ['prefix', 'crc'].includes(el.field))
        .map(el => el.size)
        .reduce((sum, val) => sum + val)
      // calculate the crc
      return CRC32(hexData.substring(crcSize * 2))
    },
    validateFrame (hexData, header) {
      let valid = false
      // parse header
      let prefix = header.find(el => el.field === 'prefix')
      let crc = header.find(el => el.field === 'crc')
      let size = header.find(el => el.field === 'size')
      // valid report should be more than 8 chars

      // validate by prefix, crc and size
      if (prefix.value === this.config.frame.prefix) {
        // validate CRC
        if (crc.output === this.calculateCRC32(hexData)) {
          // validate Size
          let headerSize = prefix.size + crc.size + size.size
          if (size.value === ((hexData.length / 2) - headerSize)) {
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
    parseHeader (hexData) {
      // get header field for header and frame decision
      let elCursor = 0
      let header = []
      // parse frame by header
      Header.forEach(el => {
        let valFormat = el.format(hexData.substr(elCursor, el.size * 2))
        // update cursor position
        elCursor += (el.size * 2)
        // fill data
        header.push({
          ...el,
          value: valFormat,
          output: el.display(valFormat)
        })
      })

      return header
    },
    buildACK (frameID, sequentialID) {
      let hex = ''

      ACK.forEach((ele, i) => {
        let el = ACK[ACK.length - 1 - i]

        switch (el.field) {
          case 'sequentialID':
            hex = el.format(sequentialID) + hex
            break
          case 'frameID':
            hex = el.format(frameID) + hex
            break
          case 'prefix':
            hex = el.format() + hex
            break
          default:
            break
        }
      })

      return hex.toUpperCase()
    },
    buildNACK () {
      let hex = AsciiToHex(config.nack.prefix)

      return hex.toUpperCase()
    }
  },
  sockets: {
    connected: function () {
      let socketServer = `${this.config.socket.address}:${this.config.socket.port}`
      this.$q.notify({
        message: `Connected to Socket Server ${socketServer}`,
        type: 'positive',
        position: this.$q.platform.is.desktop ? 'bottom-right' : 'top-right'
      })
    },
    frameReceived: function (res) {
      let valid = false
      let hexData = res.hexData
      let client = res.client
      let header = null
      let reply = null

      // calculate minimum data size for header
      let headerSize = Header
        .map(el => el.size)
        .reduce((sum, val) => sum + val)
      // check minimum data size
      if (hexData.length > (headerSize * 2)) {
        // parse header
        header = this.parseHeader(hexData)
        // validate frame
        valid = this.validateFrame(hexData, header)
        // handle valid frame
        if (valid) {
          // frame is valid
          let unitID = header.find(el => el.field === 'unitID').value
          let frameID = header.find(el => el.field === 'frameID').value
          let sequentialID = header.find(el => el.field === 'sequentialID').value
          // add unit (if not exist)
          this.$store.commit('database/ADD_UNITS', {
            unitID,
            client
          })

          // handle to corresponding frame
          if (frameID === this.config.frame.id.RESPONSE) {
            // response frame
            console.log(`RESPONSE ${hexData}`)
            // handle response
            this.$root.$emit('handleResponse', { hexData })
          } else {
            // if duplicate discard
            if (this.uniqueReport(unitID, sequentialID)) {
              console.log(`REPORT ${hexData}`)
              // handle report
              this.$root.$emit('handleReport', {
                hexData,
                frameID
              })
            } else {
              console.warn(`REPORT (DUPLICATE) ${hexData}`)
            }
          }

          // prepare ACK
          reply = this.buildACK(frameID, sequentialID)

          // check command
          if (this.theCommand !== null && !this.loading) {
            if (unitID === this.theCommand.unitID) {
              // set command
              reply += this.theCommand.hex
              // send command, wait response
              this.$root.$emit('startWaitting', this.theCommand.timeout)
            }
          }
        } else {
          console.error(`CORRUPT ${hexData}`)
        }
      } else {
        console.warn(`CORRUPT: Bellow minimum size`)
      }

      // reply the REPORT frame
      this.$socket.emit('send', {
        client,
        hex: reply || this.buildNACK()
      })
    }
  }
}
</script>
