<template>
  <q-page>
    <q-splitter
      v-model="splitter"
      style="height: calc(100vh - 50px)"
      horizontal
    >
      <template v-slot:before>
        <map-management></map-management>
      </template>
      <template v-slot:separator>
        <q-avatar
          color="grey"
          text-color="white"
          size="20px"
          icon="drag_indicator"
        />
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
            <driver-management
              :content-style="contentStyle"
            ></driver-management>
          </q-tab-panel>
          <q-tab-panel name="tab-3">
            <global-configuration
              :content-style="contentStyle"
            ></global-configuration>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<style></style>

<script>
import ReportLog from "components/ReportLog";
import MapManagement from "components/MapManagement";
import DriverManagement from "components/DriverManagement";
import GlobalConfiguration from "components/GlobalConfiguration";

import { ref, computed } from "vue";
import { createNamespacedHelpers } from "vuex";
const { useGetters } = createNamespacedHelpers("db");

export default {
  // name: 'PageIndex',
  components: {
    MapManagement,
    ReportLog,
    DriverManagement,
    GlobalConfiguration,
  },
  setup(props) {
    const { devReports, devFingers } = useGetters(["devReports", "devFingers"]);

    const selectedTab = ref("tab-1");
    const splitter = ref(50);

    const contentStyle = computed(
      () => `height: calc(100vh - ${splitter.value}vh - 95px)`
    );

    return {
      selectedTab,
      splitter,

      devReports,
      devFingers,
      contentStyle,
    };
  },
};
</script>
