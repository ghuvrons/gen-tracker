<template>
  <div :style="contentStyle">
    <q-banner v-if="devReports.length == 0">
      <template v-slot:avatar>
        <q-icon name="info"></q-icon>
      </template>
      No report yet
    </q-banner>
    <q-virtual-scroll v-else :items="devReports" separator>
      <template v-slot="{ item: devReport, index }">
        <q-item
          :key="index"
          :active="devReport.hex === report.hex"
          active-class="bg-primary text-white"
          @click="setReport(devReport)"
          clickable
          dense
        >
          <q-item-section avatar>
            <div>
              <q-chip
                :color="
                  devReport.frameID.out == 'FULL' ? 'green' : 'light-green'
                "
                class="q-ml-sm text-center"
                style="width: 60px"
                dark
                dense
                square
                >{{ devReport.frameID.out }}</q-chip
              >

              <q-chip color="primary" dark dense square>{{
                getDatetime(devReport.logDatetime)
              }}</q-chip>
            </div>
          </q-item-section>

          <q-item-section>
            <q-item-label class="ellipsis">{{ devReport.hex }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        @click="followState = !followState"
        :icon="followState ? 'lock' : 'lock_open'"
        :color="followState ? 'secondary' : 'grey'"
        :disable="devReports.length == 0"
        fab-mini
      >
        <q-tooltip anchor="top middle" self="bottom middle">{{
          followState ? "Unfollow" : "Follow"
        }}</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import dayjs from "src/js/dayjs";

import { SET_REPORT } from "src/store/db/mutation-types";
import { SET_FOLLOW } from "src/store/common/mutation-types";

import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  // name: 'ComponentName',
  props: {
    contentStyle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const report = computed(() => store.state.db.report);
    const devReports = computed(() => store.getters[`db/devReports`]);
    const setReport = (v) => store.commit(SET_REPORT, v);
    const follow = computed(() => store.state.common.follow);
    const setFollow = (v) => store.commit(SET_FOLLOW, v);

    const followState = computed({
      get: () => follow.value,
      set: (v) => setFollow(v)
    });

    const getDatetime = (logDatetime) =>
      dayjs.unix(logDatetime.val).format("HH:mm:ss");

    return {
      report,
      devReports,
      followState,

      setReport,
      getDatetime
    };
  }
});
</script>

<style></style>
