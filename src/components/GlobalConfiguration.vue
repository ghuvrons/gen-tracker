<template>
  <div class="row justify-between items-center" style="height: 150px">
    <div class="col-auto">
      <q-btn
        class="q-ma-xs"
        icon="delete"
        color="negative"
        label="Clear all data"
        :disable="units.length == 0"
        @click="clearStore()"
      />
    </div>
    <div class="col-auto">
      <q-btn
        class="q-ma-xs"
        icon="stop"
        color="primary"
        label="Ingnore command"
        @click="$root.$emit('ignoreCommand')"
      />
    </div>
    <div class="col-auto">
      <json-csv
        :data="exportedData"
        :labels="exportedLabel"
        :name="exportedFilename"
      >
        <q-btn class="q-ma-xs" icon="cloud_download" label="Download CSV" />
      </json-csv>
    </div>
    <div class="col-auto">
      <q-toggle
        v-model="timeCalibrationState"
        label="Time Calibration"
        class="q-ma-xs"
      />
    </div>
  </div>
</template>

<script>
import JsonCsv from 'vue-json-csv'
import moment from 'moment'
import { Report } from '../components/js/frame'
import { devReports } from '../store/db/getter-types'
import { RESET_DATABASE } from '../store/db/action-types'
import { TOGGLE_TIME_CALIBRATION } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  // name: 'ComponentName',
  components: {
    JsonCsv
  },
  computed: {
    ...mapState('db', ['units', 'timeCalibration']),
    ...mapGetters('db', [devReports]),
    timeCalibrationState: {
      get() {
        return this.timeCalibration
      },
      set(value) {
        this.TOGGLE_TIME_CALIBRATION()
      }
    },
    exportedData() {
      return (
        this.devReports
          // .reverse()
          .map(({ data }) =>
            data
              .reverse()
              .filter(({ chartable }) => chartable)
              .reduce(
                (carry, { field, value, output, unit }) => ({
                  ...carry,
                  [field]: output
                }),
                {}
              )
          )
      )
    },
    exportedLabel() {
      return Report.reduce(
        (carry, { field, title, unit }) => ({
          ...carry,
          [field]: title + (unit ? ` (${unit})` : '')
        }),
        {}
      )
    },
    exportedFilename() {
      let now = moment().format('YYYYMMDDHHmmss')
      return `tracking-${now}.csv`
    }
  },
  methods: {
    ...mapMutations('db', [TOGGLE_TIME_CALIBRATION]),
    ...mapActions('db', [RESET_DATABASE]),
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
  }
}
</script>

<style></style>
