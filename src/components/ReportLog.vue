<template>
  <div class="row gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="blue"
        label="MAPABLE"
        :icon="lock.mapable ? 'layers' : 'layers_clear'"
        class="q-ma-xs"
        dense
        :outline="!lock.mapable"
        :loading="loading"
        :disable="devReports.length == 0"
        @click="lock.mapable = !lock.mapable"
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
            v-for="(el, index) in devReports"
            :key="index"
            :class="{
              'bg-dark text-white': el.hexData === theReport.hexData,
            }"
            @click.native="setTheReport(el)"
          >
            <q-item-side>
              <q-chip color="primary" dense square>
                <!-- {{devReports.length - index}} -->
                {{ getSequentialID(el.data) }}
              </q-chip>
            </q-item-side>
            <q-item-main :label="el.hexData" class="q-caption" />
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
        mapable: false
      }
    }
  },
  computed: {
    ...mapState('db', ['loading', 'theUnit', 'theReport']),
    ...mapGetters('db', [devReports])
  },
  methods: {
    ...mapMutations('db', [SET_THE_REPORT]),
    setTheReport(report) {
      this.SET_THE_REPORT(report)
    },
    getSequentialID(data) {
      return data.find(({ field }) => field === 'sequentialID').value
    }
  },
  watch: {
    theReport(report) {
      if (report)
        if (this.devReports[0].hexData === report.hexData)
          this.$refs.scroller.setScrollPosition(0)
    },
    devReports: {
      immediate: true,
      handler(newReports, oldReports) {
        let newReport = newReports[0]
        let trigger = false
        let oldReportsLength = 0

        // get last reporst length
        if (oldReports) oldReportsLength = oldReports.length

        // checking
        if (!this.theReport)
          // set for the first time (theReport is null)
          trigger = true
        else if (newReport.unitID !== this.theReport.unitID)
          // set again on different unitID
          trigger = true
        else {
          // only update if got new data
          if (newReports.length !== oldReportsLength) {
            if (this.lock.follow) {
              // same unitID, but lock.follow is active
              trigger = true
              // only follow mapable reports
              if (this.lock.mapable) {
                // find the latest mapable report (it can be other than the report input)
                let reportMapable = newReports.find(
                  ({ frameID }) => frameID === this.$config.frame.id.FULL
                )
                if (reportMapable) newReport = reportMapable
              }
            }
          }
        }

        if (trigger) this.setTheReport(newReport)
      }
    }
  }
}
</script>

<style></style>
