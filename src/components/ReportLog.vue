<template>
  <div :style="`height: calc(100vh - ${height}vh - 105px)`">
    <q-virtual-scroll :items="devReports" separator>
      <template v-slot="{ item: devReport, index }">
        <q-item
          :key="index"
          :active="devReport.hex === report.hex"
          active-class="bg-primary text-white"
          @click="SET_REPORT(devReport)"
          clickable
          dense
        >
          <q-item-section avatar>
            <div>
              <q-chip
                :color="devReport.frameID.out == 'FULL' ? 'green' : 'light-green'"
                class="q-ml-sm text-center"
                style="width: 60px"
                dark
                dense
                square
              >{{ devReport.frameID.out }}</q-chip>

              <q-chip color="primary" dark dense square>{{ getDatetime(devReport) }}</q-chip>
            </div>
          </q-item-section>

          <q-item-section>
            <q-item-label class="ellipsis">{{ devReport.hex }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:after>
        <q-banner v-if="devReports.length == 0">
          <template v-slot:avatar>
            <q-icon name="info"></q-icon>
          </template>
          No report yet
        </q-banner>
      </template>
    </q-virtual-scroll>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        @click="lock.follow = !lock.follow"
        :icon="lock.follow ? 'lock' : 'lock_open'"
        :disable="devReports.length == 0"
        :color="lock.follow ? 'secondary' : 'grey'"
        fab-mini
      >
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
        >{{ lock.follow ? "Unfollow" : "Follow" }}</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { unix2time } from "components/js/utils";
import { devReports } from "src/store/db/getter-types";
import { SET_REPORT } from "src/store/db/mutation-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  props: {
    height: {
      required: true,
    },
  },
  data() {
    return {
      lock: {
        follow: true,
      },
    };
  },
  computed: {
    ...mapState("db", ["report"]),
    ...mapGetters("db", [devReports]),
  },
  methods: {
    ...mapMutations("db", [SET_REPORT]),
    getDatetime({ logDatetime }) {
      return unix2time(logDatetime.val);
    },
  },
  watch: {
    devReports: {
      immediate: true,
      handler(devReports) {
        if (devReports.length == 0) return;

        if (this.lock.follow) this.SET_REPORT(devReports[0]);
      },
    },
  },
};
</script>

<style></style>
