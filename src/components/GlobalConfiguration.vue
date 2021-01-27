<template>
  <div class="row justify-between items-center" style="height: 150px">
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
        label="Ingnore command"
        :disable="!theCommand"
        @click="$root.$emit('ignoreCommand')"
      />
    </div>
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
          label="Export Data"
          :disable="devReports.length == 0"
        />
      </json-csv>
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
</template>

<script>
import JsonCsv from 'vue-json-csv'
import { devReports } from '../store/db/getter-types'
import { RESET_DATABASE } from '../store/db/action-types'
import { TOGGLE_CALIBRATION } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { makeExport } from 'components/js/exporter'

export default {
  // name: 'ComponentName',
  components: {
    JsonCsv
  },
  computed: {
    ...mapState('db', ['units', 'calibration', 'theCommand']),
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
      return makeExport(this.devReports)
    }
  },
  methods: {
    ...mapMutations('db', [TOGGLE_CALIBRATION]),
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
