<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-auto q-ma-sm">
          <q-btn
            class="q-ma-xs"
            icon="delete"
            color="negative"
            label="Clear data"
            :disable="units.length == 0"
            @click="clearStore()"
          />
        </div>
        <div class="col-auto q-ma-sm">
          <q-btn
            class="q-ma-xs"
            icon="stop"
            color="primary"
            label="Ignore command"
            :disable="!theCommand"
            @click="$root.$emit('ignoreCommand')"
          />
        </div>
        <div class="col-auto q-ma-sm">
          <q-btn
            class="q-ma-xs"
            icon="cloud_download"
            color="green"
            label="Export CSV"
            :disable="reports.length == 0"
            @click.native="exportCSV()"
          />
        </div>
        <div class="col-auto q-ma-sm">
          <q-btn
            class="q-ma-xs"
            icon="cloud_download"
            color="purple"
            label="Export JSON"
            :disable="reports.length == 0"
            @click.native="exportJSON()"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-auto q-ma-sm">
          <q-uploader
            class="q-ma-sm"
            ref="importer"
            :dark="darker"
            :upload-factory="importJSON"
            url=""
            extensions=".json"
            stack-label="Import JSON"
            auto-expand
            hide-upload-progress
          />
        </div>
      </div>
      <div class="row">
        <div class="col-auto q-ma-sm">
          <q-toggle
            :dark="darker"
            class="q-pt-lg"
            v-model="darkState"
            label="Dark Mode"
          />
        </div>
        <div class="col-auto q-ma-sm">
          <q-toggle
            :dark="darker"
            class="q-pt-lg"
            v-model="calibrationState"
            label="Time Calibration"
            :disable="units.length == 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { devReports } from '../store/db/getter-types'
import { RESET_DATABASE } from '../store/db/action-types'
import { TOGGLE_CALIBRATION, TOGGLE_DARKER } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { exportCSV, exportJSON } from 'components/js/exporter'
import { calibrateTime } from 'components/js/utils'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  computed: {
    ...mapState('db', ['units', 'calibration', 'theCommand', 'reports']),
    ...mapGetters('db', [devReports]),
    calibrationState: {
      get() {
        return this.calibration
      },
      set(value) {
        this.TOGGLE_CALIBRATION()
      }
    },
    darkState: {
      get() {
        return this.darker
      },
      set(value) {
        this.TOGGLE_DARKER()
      }
    }
  },
  methods: {
    ...mapMutations('db', [TOGGLE_CALIBRATION, TOGGLE_DARKER]),
    ...mapActions('db', [RESET_DATABASE]),
    exportJSON() {
      exportJSON(this.reports)
    },
    exportCSV() {
      exportCSV(this.reports)
    },
    importJSON(file, updateProgress) {
      if (this.reports.length == 0) {
        let reader = new FileReader()
        reader.onload = (e) => {
          this.$root.$emit(
            'importReport',
            JSON.parse(e.target.result).reverse()
          )
          this.$refs.importer.reset()
        }
        reader.readAsText(file)
      } else {
        this.$q.notify({
          message: 'Database should empty',
          type: 'negative'
        })
      }
    },
    clearStore() {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove all data?`,
          preventClose: true,
          cancel: true
        })
        .then(() => this.RESET_DATABASE())
        .catch(() => {})
    }
  },
  watch: {
    devReports: function (reports) {
      if (reports.length > 0) {
        if (this.calibration) {
          let { frameID, gpsLatitude, gpsLongitude, sendDatetime } = reports[0]
          if (frameID.val === this.$config.frame.id.FULL) {
            let validTime = calibrateTime({
              lat: gpsLatitude.val,
              lng: gpsLongitude.val,
              datetime: sendDatetime.val
            })
            if (validTime) {
              this.$root.$emit('executeCommand', `REPORT_RTC=${validTime}`)
              this.$q.notify({ message: 'Calibrating device time..' })
            }
          }
        }
      }
    }
  }
}
</script>

<style></style>
