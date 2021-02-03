<template>
  <div class="row gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="purple"
        label="FETCH"
        class="q-ma-xs"
        dense
        :disable="!theUnit"
        :loading="loading"
        @click="fetchFinger()"
      />
      <q-btn
        color="green"
        label="ADD"
        class="q-ma-xs"
        dense
        :disable="!theUnit"
        :loading="loading"
        @click="addFinger()"
      />
      <q-btn
        color="red"
        label="RESET"
        class="q-ma-xs"
        dense
        :disable="loading || !theUnit"
        :loading="loading"
        @click="resetFinger()"
      />
    </div>
    <div class="col-xs-12">
      <q-scroll-area :style="{ height: (height < 150 ? 150 : height) + 'px' }">
        <q-list
          :dark="darker"
          highlight
          separator
          dense
          link
          v-if="devFingers.length > 0"
        >
          <q-item
            v-for="(driver, index) in devFingers"
            :key="index"
            :dark="darker"
          >
            <q-item-side>
              <q-chip color="primary" square>
                {{ driver.fingerID }}
              </q-chip>
            </q-item-side>
            <q-item-main> Mr. {{ name[driver.fingerID - 1] }}</q-item-main>
            <q-item-side right>
              <q-btn
                round
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
import { extractCommand } from 'components/js/command'
import { parseResCode } from 'components/js/response'
import { devFingers, devCommands } from '../store/db/getter-types'
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
    ...mapState('db', ['theUnit']),
    ...mapGetters('db', [devFingers, devCommands])
  },
  mounted() {
    if (this.theUnit) this.fetchFinger()
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
          preventClose: true,
          cancel: true
        })
        .then(() =>
          this.$root.$emit('executeCommand', `FINGER_DEL=${fingerID}`)
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
    }
  },
  watch: {
    devCommands: {
      deep: true,
      handler(commands) {
        if (commands.length > 0) {
          let { resCode, payload, unitID, message } = commands[0]
          let { prop, value } = extractCommand(payload)
          let res = parseResCode(resCode)

          if (res.title == 'OK') {
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
