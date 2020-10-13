<template>
    <div class="shadow-1">
        <p class="q-pa-sm q-mb-none">
            Report Reader
            <q-chip color="negative" dense square v-if="theReport">
                {{
                    theReport.frameID === config.frame.id.FULL
                        ? "FULL"
                        : "SIMPLE"
                }}
            </q-chip>
        </p>

        <!-- <q-scroll-area
            class="bg-white"
            :style="{ height: (height < 150 ? 150 : height) + 'px' }"
        > -->
        <q-list separator dense v-if="theReport">
            <!-- the new required frame -->
            <q-item
                v-for="data in requiredReport"
                :link="selectedReports.length > 1 && data.chartable"
                :key="data.field"
                :class="{ 'bg-dark text-white': activeField(data) }"
                @click.native="openReportStatistics(data)"
            >
                <q-item-main>
                    <q-item-tile label>{{ data.title }}</q-item-tile>
                    <q-item-tile
                        sublabel
                        :text-color="activeField(data) ? 'yellow' : null"
                        >{{ data.output }} {{ data.unit }}</q-item-tile
                    >
                </q-item-main>
                <q-item-side right color="green" icon="cloud_download" />
            </q-item>
            <!-- add latest optional frame -->
            <q-item
                v-for="data in optionalReport"
                :link="selectedReports.length > 1 && data.chartable"
                :key="data.field"
                :class="{ 'bg-dark text-white': activeField(data) }"
                @click.native="openReportStatistics(data)"
            >
                <q-item-main>
                    <q-item-tile label>{{ data.title }}</q-item-tile>
                    <q-item-tile sublabel
                        >{{ data.output }} {{ data.unit }}</q-item-tile
                    >
                </q-item-main>
                <q-item-side
                    right
                    :color="
                        theReport.frameID === config.frame.id.FULL
                            ? 'green'
                            : 'red'
                    "
                    :icon="
                        theReport.frameID === config.frame.id.FULL
                            ? 'cloud_download'
                            : 'cloud_off'
                    "
                />
            </q-item>
        </q-list>

        <q-alert v-else icon="info" color="faded" class="q-ma-xs">
            No active report yet
        </q-alert>
        <!-- </q-scroll-area> -->

        <report-statistics
            :height="height - 210"
            :data="statisticsData"
            @close="closeReportStatistics()"
        >
        </report-statistics>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");

import ReportStatistics from "components/ReportStatistics";
import { Report } from "../utils/frame";

export default {
    // name: 'ComponentName',
    props: {
        height: Number,
    },
    components: {
        ReportStatistics,
    },
    created() {
        this.$root.$on("handleReport", this.handleReport);
    },
    destroyed() {
        this.$root.$off("handleReport", this.handleReport);
    },
    data() {
        return {
            statisticsData: null,
        };
    },
    computed: {
        ...mapState("app", ["settings", "config"]),
        ...mapState("database", ["theReport"]),
        ...mapGetters("database", ["selectedReports"]),
        timeCalibrationState() {
            return this.settings.timeCalibration;
        },
        requiredReport() {
            return this.theReport.data.filter(({ required }) => required);
        },
        optionalReport() {
            let nearestOptional = [];

            // use nearest full frame
            let selectedIndex = this.selectedReports.findIndex(
                ({ hexData }) => hexData === this.theReport.hexData
            );
            for (let index = selectedIndex; index >= 0; index--) {
                if (
                    this.selectedReports[index].frameID ===
                    this.config.frame.id.FULL
                ) {
                    nearestOptional = this.selectedReports[index].data.filter(
                        ({ required }) => !required
                    );
                    break;
                }
            }

            return nearestOptional;
        },
    },
    methods: {
        ...mapMutations("database", ["ADD_REPORTS"]),
        openReportStatistics(data) {
            this.statisticsData = data;
        },
        closeReportStatistics() {
            this.statisticsData = null;
        },
        calibrateDeviceTime(report) {
            let timezone = "Asia/Jakarta";
            let lat = report.data.find(({ field }) => field === "gpsLatitude")
                .value;
            let lng = report.data.find(({ field }) => field === "gpsLongitude")
                .value;
            let sendTime = report.data.find(
                ({ field }) => field === "rtcSendDatetime"
            ).value;

            // correct timestamp if not sync with server
            if (lat !== 0 && lng !== 0) {
                timezone = tzlookup(lat, lng);
            }
            let serverTime = moment(new Date());
            let deviceTime = moment(sendTime, "X");
            let difference = Math.abs(
                moment.duration(serverTime.diff(deviceTime)).as("seconds")
            );

            //  (at least more n minutes different)
            if (
                !deviceTime.isValid() ||
                difference > this.config.frame.calibratedSeconds
            ) {
                let validTime = serverTime.tz(timezone).format("YYMMDDHHmmssE");

                // send command to fix the RTC time
                let payload = `REPORT_RTC=${validTime}`;
                this.$root.$emit("executeCommand", { payload });
                // give notification
                this.$q.notify({
                    message: "Calibrating device time",
                });
            }
        },
        activeField(data) {
            let active = false;
            if (this.statisticsData) {
                active = data.field === this.statisticsData.field;
            }

            return active;
        },
        parseReport({ hexData, frameID }) {
            let data = [];
            let elCursor = 0;
            // loop for each element
            Report.forEach((el) => {
                if (
                    (frameID === this.config.frame.id.SIMPLE && el.required) ||
                    frameID === this.config.frame.id.FULL
                ) {
                    let rawHex = hexData.substr(elCursor, el.size * 2);
                    let valFormat = el.format(rawHex);
                    // update cursor position
                    elCursor += el.size * 2;
                    // fill data
                    data.push({
                        ...el,
                        value: valFormat,
                        output: el.display(valFormat),
                    });
                }
            });

            return {
                unitID: data.find(({ field }) => field === "unitID").value,
                frameID,
                data,
                hexData,
            };
        },
        handleReport(prop) {
            let report = this.parseReport(prop);
            this.ADD_REPORTS(report);

            // check device time, calibrate if error
            if (this.timeCalibrationState) {
                if (report.frameID === this.config.frame.id.FULL) {
                    this.calibrateDeviceTime(report);
                }
            }
        },
    },
};
</script>

<style></style>
