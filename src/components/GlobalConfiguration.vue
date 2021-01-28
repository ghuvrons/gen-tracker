<template>
  <div class="row gutter-lg">
    <div class="col-12">
      <div class="row gutter-lg">
        <div class="col-auto">
          <q-btn
            class="q-ma-xs"
            icon="delete"
            color="negative"
            label="Clear data"
            :disable="units.length == 0"
            @click="clearStore()"
          />
        </div>
        <div class="col-auto">
          <q-btn
            class="q-ma-xs"
            icon="stop"
            color="primary"
            label="Ignore command"
            :disable="!theCommand"
            @click="$root.$emit('ignoreCommand')"
          />
        </div>
        <div class="col-auto">
          <q-toggle
            v-model="calibrationState"
            label="Time Calibration"
            class="q-ma-xs"
            :disable="units.length == 0"
          />
        </div>
      </div>
      <div class="row gutter-lg">
        <div class="col-auto">
          <json-csv
            :data="exported.data"
            :labels="exported.label"
            :name="exported.name"
          >
            <q-btn
              class="q-ma-xs"
              icon="cloud_download"
              color="green"
              label="Export CSV"
              :disable="reports.length == 0"
            />
          </json-csv>
        </div>
        <div class="col-auto">
          <q-btn
            class="q-ma-xs"
            icon="cloud_download"
            color="purple"
            label="Export JSON"
            :disable="reports.length == 0"
            @click.native="exportJson()"
          />
        </div>
      </div>
      <div class="row gutter-lg">
        <div class="col-auto">
          <q-uploader
            class="q-ma-sm"
            ref="importer"
            :upload-factory="importJson"
            url=""
            extensions=".json"
            stack-label="Import JSON"
            auto-expand
            hide-upload-progress
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsonCsv from 'vue-json-csv'
import { devReports } from '../store/db/getter-types'
import { RESET_DATABASE } from '../store/db/action-types'
import { TOGGLE_CALIBRATION } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { makeExportCSV, makeExportJSON } from 'components/js/exporter'

export default {
  // name: 'ComponentName',
  components: {
    JsonCsv
  },
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
    exported() {
      return makeExportCSV(this.devReports)
    }
  },
  methods: {
    ...mapMutations('db', [TOGGLE_CALIBRATION]),
    ...mapActions('db', [RESET_DATABASE]),
    exportJson() {
      makeExportJSON(this.devReports)
    },
    importJson(file, updateProgress) {
      let reader = new FileReader()
      reader.onload = (e) => {
        if (this.reports.length == 0) {
          this.$root.$emit('importReport', JSON.parse(e.target.result))
          this.$refs.importer.reset()
        } else {
          this.$q.notify({
            message: 'Database should empty',
            type: 'negative'
          })
        }
      }
      reader.readAsText(file)
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
  }
}
</script>

<style></style>
