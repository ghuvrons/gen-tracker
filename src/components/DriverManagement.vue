<template>
  <div class="row gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="green"
        label="ADD"
        class="q-ma-xs"
        dense
        outline
        :disable="devFingers.length >= $config.finger.max || !theUnit"
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
        <q-list highlight separator dense link v-if="devFingers.length > 0">
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
import {
  ADD_FINGERS,
  DELETE_FINGERS,
  RESET_FINGERS
} from '../store/db/mutation-types'
import { devFingers } from '../store/db/getter-types'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { makeFingerID } from 'components/js/utils'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  created() {
    this.$root.$on('hookResponseFinger', this.hookResponse)
  },
  destroyed() {
    this.$root.$off('hookResponseFinger', this.hookResponse)
  },
  computed: {
    ...mapState('db', ['loading', 'theUnit']),
    ...mapGetters('db', [devFingers])
  },
  methods: {
    ...mapMutations('db', [ADD_FINGERS, DELETE_FINGERS, RESET_FINGERS]),
    addFinger() {
      let id = makeFingerID(this.devFingers)

      if (id < 0) {
        this.$q.notify({ message: 'Finger full.' })
        return
      }

      this.$q
        .dialog({
          title: 'Add driver',
          message: 'Initial Name of driver.',
          preventClose: true,
          cancel: false,
          color: 'secondary',
          prompt: {
            model: '',
            type: 'text'
          }
        })
        .then((data) =>
          this.$root.$emit('executeCommand', `FINGER_ADD=${id},${data}`)
        )
    },
    deleteFinger(driver) {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove this fingerprint *${driver.name}* ?`,
          preventClose: true,
          cancel: true
        })
        .then(() =>
          this.$root.$emit('executeCommand', `FINGER_DEL=${driver.fingerID}`)
        )
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
        .then(() => this.$root.$emit('executeCommand', `FINGER_RST`))
        .catch(() => {})
    },

    hookResponse({ unitID, command, value }) {
      switch (command) {
        case 'FINGER_ADD':
          this.ADD_FINGERS({
            fingerID: value,
            unitID
          })
          break
        case 'FINGER_DEL':
          this.DELETE_FINGERS({
            fingerID: value,
            unitID
          })
          break
        case 'FINGER_RST':
          this.RESET_FINGERS({
            unitID
          })
          break

        default:
          break
      }
    }
  }
}
</script>

<style>
</style>
