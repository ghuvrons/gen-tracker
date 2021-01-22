<template>
  <q-page class="q-pa-xs">
    <!--
          we listen for size changes on this above
          <element>, so we place the observer as direct child:
        -->
    <q-resize-observable @resize="onResizePage" />
    <!--can be placed anywhere within your template -->
    <q-window-resize-observable @resize="onResize" />

    <map-management :height="mapHeight" :pageWidth="pageWidth">
    </map-management>

    <q-tabs v-model="selectedTab" inverted animated swipeable>
      <!-- Tabs - notice slot="title" -->
      <q-tab
        :count="devReports.length"
        slot="title"
        name="tab-1"
        label="Report Log"
      />
      <q-tab
        :count="devFingers.length"
        slot="title"
        name="tab-2"
        label="Driver Management"
      />
      <q-tab slot="title" name="tab-3" label="Configuration" />
      <!-- Targets -->
      <q-tab-pane name="tab-1">
        <report-log :height="paneHeight"></report-log>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <driver-management :height="paneHeight"></driver-management>
      </q-tab-pane>
      <q-tab-pane name="tab-3">
        <global-configuration></global-configuration>
      </q-tab-pane>
    </q-tabs>
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

export default {
  // name: 'PageIndex',
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
    onResize({ height }) {
      this.paneHeight = height - this.mapHeight - 180
    },
    onResizePage({ width }) {
      this.pageWidth = width
    }
  }
}
</script>
