<template>
    <q-tabs v-model="selectedTab" inverted animated swipeable>
        <!-- Tabs - notice slot="title" -->
        <q-tab
            :count="selectedReports.length"
            slot="title"
            name="tab-1"
            label="Report Log"
        />
        <q-tab
            :count="selectedFingers.length"
            slot="title"
            name="tab-2"
            label="Driver Management"
        />
        <q-tab slot="title" name="tab-3" label="Configuration" />

        <!-- Targets -->
        <q-tab-pane name="tab-1">
            <report-log :height="height"></report-log>
        </q-tab-pane>
        <q-tab-pane name="tab-2">
            <driver-management :height="height"></driver-management>
        </q-tab-pane>
        <q-tab-pane name="tab-3">
            <global-configuration></global-configuration>
        </q-tab-pane>
    </q-tabs>
</template>

<script>
import { mapGetters } from "vuex";

import ReportLog from "components/ReportLog";
import DriverManagement from "components/DriverManagement";
import GlobalConfiguration from "components/GlobalConfiguration";

export default {
    props: {
        height: Number,
        default: 200,
    },
    components: {
        ReportLog,
        DriverManagement,
        GlobalConfiguration,
    },
    data() {
        return {
            selectedTab: "tab-1",
        };
    },
    computed: {
        ...mapGetters("database", ["selectedReports", "selectedFingers"]),
    },
};
</script>

<style>
</style>
