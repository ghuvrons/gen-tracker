<template>
    <q-page class="q-pa-xs">
        <!--can be placed anywhere within your template -->
        <q-window-resize-observable @resize="onResize" />
        <!--
          we listen for size changes on this above
          <element>, so we place the observer as direct child:
        -->
        <q-resize-observable @resize="onResizePage" />

        <map-management :height="mapHeight" :pageWidth="pageWidth">
        </map-management>

        <main-tabs :height="paneHeight"></main-tabs>
    </q-page>
</template>

<style></style>

<script>
import { mapGetters } from "vuex";

import MapManagement from "components/MapManagement";
import MainTabs from "../components/MainTabs";

export default {
    // name: 'PageIndex',
    components: {
        MapManagement,
        MainTabs,
    },
    data() {
        return {
            mapHeight: 0,
            pageWidth: 0,
            paneHeight: 150,
        };
    },
    computed: {
        ...mapGetters("database", ["selectedReports", "selectedFingers"]),
    },
    methods: {
        onResize({ height }) {
            this.mapHeight = height - this.paneHeight - 180;
        },
        onResizePage({ width }) {
            this.pageWidth = width;
        },
    },
};
</script>
