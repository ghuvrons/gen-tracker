<template>
  <div class="row gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="green"
        label="ADD"
        class="q-ma-xs"
        dense
        outline
        :disable="selectedFingers.length >= config.finger.max || !theUnit"
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
      <q-scroll-area :style="{height: (height < 150 ? 150 : height) + 'px'}">
        <q-list
          highlight
          separator
          dense
          link
          v-if="selectedFingers.length"
        >
          <q-item
            v-for="(user, index) in selectedFingers"
            :key="index"
          >

            <q-item-side>
              <q-chip
                color="primary"
                square
              >
                {{user.fingerID}}
              </q-chip>
            </q-item-side>
            <q-item-main :label="user.name" />
            <q-item-side right>
              <q-btn
                round
                outline
                dense
                color="red"
                size="sm"
                icon="delete"
                @click="deleteFinger(user)"
                :loading="loading"
              />
            </q-item-side>
          </q-item>
        </q-list>
        <q-alert
          v-else
          class="q-ma-xs"
          icon="info"
          color="faded"
        >
          No finger user yet
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
  computed: {
    ...mapState('database', ['loading', 'config', 'theUnit']),
    ...mapGetters('database', ['selectedFingers'])
  },
  methods: {
    findFreeFingerID () {
      // find not used id
      let id = 1
      // save all registered id
      let usedFingerID = this.selectedFingers.map(el => parseInt(el.fingerID))
      // sort id to ascending
      usedFingerID.sort((a, b) => a - b)
      // check the lowest unused id
      for (let i = 0; i < this.config.finger.max; i++) {
        id = i + 1
        if (usedFingerID[i] !== id) {
          break
        }
      }
      // return the free index
      return id
    },
    addFinger () {
      // give notification to scan
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'amber',
        spinnerSize: 140,
        message: 'Put your fingerprint on scanner...',
        messageColor: 'red'
      })
      // emit to event bus
      let payload = `FINGER_ADD=${this.findFreeFingerID()}`
      this.$root.$emit('executeCommand', {
        payload,
        timeout: 30000
      })
    },
    deleteFinger (user) {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove this fingerprint *${user.name}* ?`,
          preventClose: true,
          cancel: true
        })
        .then(() => {
          // emit to event bus
          let payload = `FINGER_DEL=${user.fingerID}`
          this.$root.$emit('executeCommand', { payload })
        })
        .catch(() => { })
    },
    resetFinger () {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove all fingerprints  ?`,
          preventClose: true,
          cancel: true
        })
        .then(() => {
          // emit to event bus
          let payload = `FINGER_RST`
          this.$root.$emit('executeCommand', { payload })
        })
        .catch(() => { })
    }
  }
}
</script>

<style>
</style>
