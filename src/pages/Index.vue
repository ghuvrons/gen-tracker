<template>
  <q-page>
    <q-splitter v-model="splitter" style="height: calc(100vh - 50px)" horizontal>
      <template v-slot:before>
        <map-management></map-management>
      </template>
      <template v-slot:separator>
        <q-avatar color="grey" text-color="white" size="20px" icon="drag_indicator" />
      </template>
      <template v-slot:after>
        <q-tabs v-model="selectedTab" class="bg-primary text-white" dense>
          <q-tab name="tab-1" label="Report Log">
            <q-badge color="red" floating>{{ devReports.length }}</q-badge>
          </q-tab>
          <q-tab name="tab-2" label="Driver Management">
            <q-badge color="red" floating>{{ devFingers.length }}</q-badge>
          </q-tab>
          <q-tab name="tab-3" label="Configuration" />
        </q-tabs>

        <!-- Targets -->
        <q-tab-panels v-model="selectedTab" swipeable>
          <q-tab-panel name="tab-1">
            <report-log :content-style="contentStyle"></report-log>
          </q-tab-panel>
          <q-tab-panel name="tab-2">
            <driver-management :content-style="contentStyle"></driver-management>
          </q-tab-panel>
          <q-tab-panel name="tab-3">
            <global-configuration :content-style="contentStyle"></global-configuration>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<style></style>

<script>
import MapManagement from "components/MapManagement";
import ReportLog from "components/ReportLog";
import DriverManagement from "components/DriverManagement";
import GlobalConfiguration from "components/GlobalConfiguration";
import { devReports, devFingers } from "src/store/db/getter-types";
import { mapGetters } from "vuex";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'PageIndex',
  mixins: [CommonMixin],
  components: {
    MapManagement,
    ReportLog,
    DriverManagement,
    GlobalConfiguration,
  },
  data() {
    return {
      selectedTab: "tab-1",
      splitter: 50,
    };
  },
  computed: {
    ...mapGetters("db", [devReports, devFingers]),
    contentStyle() {
      return `height: calc(100vh - ${this.splitter}vh - 95px)`;
    },
  },
};
</script>
