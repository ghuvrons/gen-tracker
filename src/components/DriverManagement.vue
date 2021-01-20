<template>
  <div class="row gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="green"
        label="ADD"
        class="q-ma-xs"
        dense
        outline
        :disable="devFingers.length >= config.finger.max || !theUnit"
        :loading="loading"
        @click="addFinger()"
      />
      <q-btn
        color="red"
        label="RESET"
        class="q-ma-xs"
        dense
        outline
        :disable="loading || !theUnit"
        :loading="loading"
        @click="resetFinger()"
      />
    </div>
    <div class="col-xs-12">
      <q-scroll-area :style="{ height: (height < 150 ? 150 : height) + 'px' }">
        <q-list highlight separator dense link v-if="devFingers.length">
          <q-item v-for="(driver, index) in devFingers" :key="index">
            <q-item-side>
              <q-chip color="primary" square>
                {{ driver.fingerID }}
              </q-chip>
            </q-item-side>
            <q-item-main :label="driver.name" />
            <q-item-side right>
              <q-btn
                round
                outline
                dense
                color="red"
                size="sm"
                icon="delete"
                @click="deleteFinger(driver)"
                :loading="loading"
              />
            </q-item-side>
          </q-item>
        </q-list>
        <q-alert v-else class="q-ma-xs" icon="info" color="faded">
          No finger driver yet
        </q-alert>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { QSpinnerFacebook } from 'quasar'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  created() {
    this.$root.$on('scanningDialog', this.scanningDialog)
  },
  destroyed() {
    this.$root.$off('scanningDialog', this.scanningDialog)
  },
  computed: {
    ...mapState('database', ['loading', 'config', 'theUnit']),
    ...mapGetters('database', ['devFingers'])
  },
  methods: {
    findFreeFingerID() {
      // find not used id
      let id = 0
      // save all registered id
      let usedFingerIDs = this.devFingers.map(({ fingerID }) =>
        parseInt(fingerID)
      )
      // sort id to ascending
      usedFingerIDs.sort((a, b) => a - b)
      // check the lowest unused id
      for (let i = 0; i < this.config.finger.max; i++) {
        if (usedFingerIDs[i] !== id) break
        id++
      }
      // return the free index
      return id
    },
    scanningDialog() {
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'amber',
        spinnerSize: 140,
        message: 'Put your fingerprint on scanner...',
        messageColor: 'red'
      })
    },
    addFinger() {
      let payload = `FINGER_ADD=${this.findFreeFingerID()}`
      this.$root.$emit('executeCommand', { payload })
    },
    deleteFinger(driver) {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove this fingerprint *${driver.name}* ?`,
          preventClose: true,
          cancel: true
        })
        .then(() => {
          let payload = `FINGER_DEL=${driver.fingerID}`
          this.$root.$emit('executeCommand', { payload })
        })
        .catch(() => {})
    },
    resetFinger() {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove all fingerprints  ?`,
          preventClose: true,
          cancel: true
        })
        .then(() => {
          let payload = `FINGER_RST`
          this.$root.$emit('executeCommand', { payload })
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
