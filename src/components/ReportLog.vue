<template>
  <div class="row q-gutter-xs">
    <div class="col-xs-12 text-right">
      <q-btn
        color="green"
        label="FOLLOW"
        :icon="lock.follow ? 'lock' : 'lock_open'"
        class="q-ma-xs"
        dense
        unelevated
        :outline="!lock.follow"
        :loading="loading"
        :disable="devReports.length == 0"
        @click="lock.follow = !lock.follow"
      />
    </div>
    <div class="col-xs-12">
      <q-virtual-scroll
        v-if="devReports.length > 0"
        :style="{ height: (height < 150 ? 150 : height) + 'px' }"
        :items="devReports"
        separator
      >
        <!-- <q-list  :dark="darker" dense separator> -->
        <template v-slot="{ item: report, index }">
          <q-item
            :key="index"
            :dark="darker"
            :focused="report.hex === theReport.hex"
            @click="SET_THE_REPORT(report)"
            clickable
            dense
            manual-focus
          >
            <q-item-section avatar>
              <div>
                <q-chip
                  :color="
                    report.frameID.out == 'FULL' ? 'green' : 'light-green'
                  "
                  class="q-ml-sm text-center"
                  style="width: 60px"
                  dark
                  dense
                  square
                >
                  {{ report.frameID.out }}
                </q-chip>

                <q-chip color="primary" dark dense square>
                  {{ getDatetime(report) }}
                </q-chip>
              </div>
            </q-item-section>

            <q-item-section>
              <q-item-label class="ellipsis" caption>
                {{ report.hex }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <!-- </q-list> -->
        </template>
      </q-virtual-scroll>
      <q-banner v-else :dark="darker">
        <template v-slot:avatar>
          <q-icon name="info"></q-icon>
        </template>
        No report yet
      </q-banner>
    </div>
  </div>
</template>

<script>
import { unix2time } from 'components/js/utils'
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
        follow: true
      }
    }
  },
  computed: {
    ...mapState('db', ['theUnit', 'theReport']),
    ...mapGetters('db', [devReports])
  },
  methods: {
    ...mapMutations('db', [SET_THE_REPORT]),
    getDatetime({ logDatetime }) {
      return unix2time(logDatetime.val)
    }
  },
  watch: {
    devReports: {
      immediate: true,
      handler(reports) {
        if (reports.length > 0)
          if (this.lock.follow) this.SET_THE_REPORT(reports[0])
      }
    }
  }
}
</script>

<style></style>
