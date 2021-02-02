<template>
  <div class="row gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="blue"
        label="FULL ONLY"
        :icon="lock.full ? 'layers' : 'layers_clear'"
        class="q-ma-xs"
        dense
        :flat="!lock.full"
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
        <q-list
          :dark="darker"
          highlight
          link
          dense
          separator
          v-if="devReports.length > 0"
        >
          <q-item
            v-for="(report, index) in devReports"
            :key="index"
            :active="report.hexData === theReport.hexData"
            :dark="darker"
            @click.native="SET_THE_REPORT(report)"
          >
            <q-item-side>
              <q-chip color="primary" dense square>
                {{ getDatetime(report) }}
              </q-chip>
              <q-chip
                class="q-ml-sm"
                style="width: 60px"
                :color="
                  getFrameName(report) == 'FULL' ? 'green' : 'light-green'
                "
                dense
                square
              >
                {{ getFrameName(report) }}
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
import { getValue, unix2time } from 'components/js/utils'
import { devReports } from '../store/db/getter-types'
import { SET_THE_REPORT } from '../store/db/mutation-types'
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
      lock: {
        follow: true,
        full: false
      }
    }
  },
  computed: {
    ...mapState('db', ['theUnit', 'theReport']),
    ...mapGetters('db', [devReports])
  },
  methods: {
    ...mapMutations('db', [SET_THE_REPORT]),
    getFrameName({ frameID }) {
      return this.$config.frame.name[frameID]
    },
    getDatetime({ logDatetime }) {
      return unix2time(logDatetime)
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
