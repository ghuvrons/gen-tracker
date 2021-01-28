<template>
  <div class="row gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="blue"
        label="FULL ONLY"
        :icon="lock.full ? 'layers' : 'layers_clear'"
        class="q-ma-xs"
        dense
        :outline="!lock.full"
        :loading="loading"
        :disable="devReports.length == 0"
        @click="lock.full = !lock.full"
        v-if="lock.follow"
      />
      <q-btn
        color="green"
        label="FOLLOW"
        :icon="lock.follow ? 'lock' : 'lock_open'"
        class="q-ma-xs"
        dense
        :outline="!lock.follow"
        :loading="loading"
        :disable="devReports.length == 0"
        @click="lock.follow = !lock.follow"
      />
    </div>
    <div class="col-xs-12">
      <q-scroll-area
        :style="{ height: (height < 150 ? 150 : height) + 'px' }"
        ref="scroller"
      >
        <q-list highlight link dense separator v-if="devReports.length > 0">
          <q-item
            v-for="(report, index) in devReports"
            :key="index"
            :class="{
              'bg-dark text-white': report.hexData === theReport.hexData,
            }"
            @click.native="SET_THE_REPORT(report)"
          >
            <q-item-side>
              <q-chip color="primary" dense square>
                {{ getDatetime(report) }}
              </q-chip>
              <q-chip
                class="q-ml-sm"
                style="width: 50px"
                :color="getFrameID(report) == 'FULL' ? 'green' : 'orange'"
                dense
                square
              >
                {{ getFrameID(report) }}
              </q-chip>
            </q-item-side>
            <q-item-main class="q-caption">
              {{ report.hexData }}
            </q-item-main>
          </q-item>
        </q-list>
        <q-alert v-else icon="info" color="faded" class="q-ma-xs">
          No report yet
        </q-alert>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import { getField, unix2time } from 'components/js/utils'
import { devReports } from '../store/db/getter-types'
import { SET_THE_REPORT } from '../store/db/mutation-types'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  // name: 'ComponentName',
  props: {
    height: Number
  },
  data() {
    return {
      lock: {
        follow: true,
        full: false
      }
    }
  },
  computed: {
    ...mapState('db', ['loading', 'theUnit', 'theReport']),
    ...mapGetters('db', [devReports])
  },
  methods: {
    ...mapMutations('db', [SET_THE_REPORT]),
    getFrameID({ data }) {
      return data.find(({ field }) => field === 'frameID').output
    },
    getDatetime({ data }) {
      let unix = getField(data, 'logDatetime')
      return unix2time(unix)
    }
  },
  watch: {
    devReports: {
      immediate: true,
      handler(reports) {
        if (reports.length > 0)
          if (this.lock.follow) {
            let report = reports[0]

            if (this.lock.full)
              report = reports.find(
                ({ frameID }) => frameID === this.$config.frame.id.FULL
              )
            this.SET_THE_REPORT(report)
          }
      }
    }
  }
}
</script>

<style></style>
