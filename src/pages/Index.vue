<template>
  <q-page :class="darkerClass">
    <!--
          we listen for size changes on this above
          <element>, so we place the observer as direct child:
        -->
    <q-resize-observer @resize="onResizePage" />

    <map-management :height="mapHeight" :pageWidth="pageWidth">
    </map-management>

    <q-tabs v-model="selectedTab" class="bg-primary text-white">
      <q-tab name="tab-1" label="Report Log">
        <q-badge color="red" floating>{{ devReports.length }}</q-badge>
      </q-tab>
      <q-tab name="tab-2" label="Driver Management">
        <q-badge color="red" floating>{{ devFingers.length }}</q-badge>
      </q-tab>
      <q-tab name="tab-3" label="Configuration" />
    </q-tabs>

    <!-- Targets -->
    <q-tab-panels v-model="selectedTab" :class="darkerClass" animated swipeable>
      <q-tab-panel name="tab-1" keep-alive>
        <report-log :height="paneHeight"></report-log>
      </q-tab-panel>
      <q-tab-panel name="tab-2" keep-alive>
        <driver-management :height="paneHeight"></driver-management>
      </q-tab-panel>
      <q-tab-panel name="tab-3" keep-alive>
        <global-configuration></global-configuration>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style></style>

<script>
import MapManagement from 'components/MapManagement'
import ReportLog from 'components/ReportLog'
import DriverManagement from 'components/DriverManagement'
import GlobalConfiguration from 'components/GlobalConfiguration'
import { devReports, devFingers } from '../store/db/getter-types'
import { mapGetters } from 'vuex'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  // name: 'PageIndex',
  mixins: [CommonMixin],
  components: {
    MapManagement,
    ReportLog,
    DriverManagement,
    GlobalConfiguration
  },
  data() {
    return {
      selectedTab: 'tab-1',
      mapHeight: 300,
      paneHeight: 0,
      pageWidth: 0
    }
  },
  computed: {
    ...mapGetters('db', [devReports, devFingers])
  },
  methods: {
    onResize(height ) {
      this.paneHeight = height - this.mapHeight - 180
    },
    onResizePage({ width }) {
      this.pageWidth = width
    }
  },
  watch: {
    '$q.screen.height':{
      immediate: true,
      handler(h) {
        this.onResize(h)
      }
    }
  }
}
</script>
