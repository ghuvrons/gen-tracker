<template>
  <div class="row q-gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="purple"
        label="FETCH"
        class="q-ma-xs"
        dense
        unelevated
        :disable="!theUnit"
        :loading="loading"
        @click="fetchFinger()"
      />
      <q-btn
        color="green"
        label="ADD"
        class="q-ma-xs"
        dense
        unelevated
        :disable="!theUnit"
        :loading="loading"
        @click="addFinger()"
      />
      <q-btn
        color="red"
        label="RESET"
        class="q-ma-xs"
        dense
        unelevated
        :disable="loading || !theUnit"
        :loading="loading"
        @click="resetFinger()"
      />
    </div>
    <div class="col-xs-12">
      <q-scroll-area :style="{ height: (height < 150 ? 150 : height) + 'px' }">
        <q-list v-if="devFingers.length > 0" :dark="darker" separator dense>
          <q-item
            v-for="(driver, index) in devFingers"
            :key="index"
            :dark="darker"
          >
            <q-item-section avatar>
              <q-chip color="primary" dark square>
                {{ driver.fingerID }}
              </q-chip>
            </q-item-section>
            <q-item-section>
              <q-item-label> Mr. {{ name[driver.fingerID - 1] }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                @click="deleteFinger(driver)"
                :loading="loading"
                color="red"
                size="sm"
                icon="delete"
                unelevated
                round
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-banner v-else :dark="darker">
          <template v-slot:avatar>
            <q-icon name="info"></q-icon>
          </template>
          No finger driver yet
        </q-banner>
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
import { extractCommand } from 'components/js/command'
import { parseResCode } from 'components/js/response'
import { VEHICLE_STATES } from 'components/js/opt/report'
import { devFingers, devReports } from '../store/db/getter-types'
import { mapState, mapGetters, mapMutations } from 'vuex'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  mixins: [CommonMixin],
  data() {
    return {
      name: ['One', 'Two', 'Three', 'Four', 'Five']
    }
  },
  computed: {
    ...mapState('db', ['theUnit', 'commands']),
    ...mapGetters('db', [devFingers, devReports])
  },
  mounted() {
    if (this.devReports.length > 0)
      if (this.devReports[0].vehicleState.out >= VEHICLE_STATES['STANDBY'])
        this.fetchFinger()
  },
  methods: {
    ...mapMutations('db', [ADD_FINGERS, DELETE_FINGERS, RESET_FINGERS]),
    fetchFinger() {
      this.$root.$emit('executeCommand', `FINGER_FETCH`)
    },
    addFinger() {
      this.$root.$emit('executeCommand', `FINGER_ADD`)
    },
    deleteFinger({ fingerID }) {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove this fingerprint *${fingerID}* ?`,
          dark: this.darker,
          preventClose: true,
          cancel: true
        })
        .onOk(() =>
          this.$root.$emit('executeCommand', `FINGER_DEL=${fingerID}`)
        )
    },
    resetFinger() {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove all fingerprints  ?`,
          dark: this.darker,
          preventClose: true,
          cancel: true
        })
        .onOk(() => this.$root.$emit('executeCommand', `FINGER_RST`))
    }
  },
  watch: {
    commands: {
      deep: true,
      handler(commands) {
        if (commands.length > 0) {
          let { resCode, payload, unitID, message } = commands[0]
          let res = parseResCode(resCode)

          if (res.title == 'OK') {
            let { prop, value } = extractCommand(payload)

            if (prop == 'FINGER_FETCH') {
              if (message.length > 0) {
                let ids = message.split(',')
                for (let i = ids.length - 1; i >= 0; i--)
                  this.ADD_FINGERS({ unitID, fingerID: ids[i] })
              }
            } else if (prop == 'FINGER_ADD')
              this.ADD_FINGERS({ unitID, fingerID: message })
            else if (prop == 'FINGER_DEL')
              this.DELETE_FINGERS({ unitID, fingerID: value })
            else if (prop == 'FINGER_RST') this.RESET_FINGERS({ unitID })
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
