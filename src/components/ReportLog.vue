<template>
  <div class="row">
    <div class="col-12 text-right">
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
    <div class="col-12">
      <q-virtual-scroll
        :items="devReports"
        style="height: calc(100vh - 440px)"
        separator
      >
        <template v-slot="{ item: report, index }">
          <q-item
            :key="index"
            :dark="darker"
            :active="report.hex === theReport.hex"
            active-class="bg-primary text-white"
            @click="SET_THE_REPORT(report)"
            clickable
            dense
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
              <q-item-label class="ellipsis">
                {{ report.hex }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:after>
          <q-banner v-if="devReports.length == 0" :dark="darker">
            <template v-slot:avatar>
              <q-icon name="info"></q-icon>
            </template>
            No report yet
          </q-banner>
        </template>
      </q-virtual-scroll>
    </div>
  </div>
</template>

<script>
import { unix2time } from "components/js/utils";
import { devReports } from "../store/db/getter-types";
import { SET_THE_REPORT } from "../store/db/mutation-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  data() {
    return {
      lock: {
        follow: true,
      },
    };
  },
  computed: {
    ...mapState("db", ["theUnit", "theReport"]),
    ...mapGetters("db", [devReports]),
  },
  methods: {
    ...mapMutations("db", [SET_THE_REPORT]),
    getDatetime({ logDatetime }) {
      return unix2time(logDatetime.val);
    },
  },
  watch: {
    devReports: {
      immediate: true,
      handler(reports) {
        if (reports.length > 0)
          if (this.lock.follow) this.SET_THE_REPORT(reports[0]);
      },
    },
  },
};
</script>

<style></style>
