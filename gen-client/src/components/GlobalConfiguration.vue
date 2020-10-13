<template>
    <div class="row justify-between items-center" style="height: 150px">
        <div class="col-auto">
            <q-btn
                class="q-ma-xs"
                icon="delete"
                color="negative"
                label="Clear all data"
                :disable="!units.length"
                @click="clearStore()"
            />
        </div>
        <div class="col-auto">
            <q-btn
                class="q-ma-xs"
                icon="stop"
                color="primary"
                label="Ingnore command"
                @click="ignoreCommand()"
            />
        </div>
        <div class="col-auto">
            <json-csv
                :data="exportedData"
                :labels="exportedLabel"
                :name="exportedFilename"
            >
                <q-btn
                    class="q-ma-xs"
                    icon="cloud_download"
                    label="Download CSV"
                    color="purple"
                />
            </json-csv>
        </div>
        <div class="col-auto">
            <q-toggle
                v-model="timeCalibrationState"
                label="Time Calibration"
                class="q-ma-xs"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import JsonCsv from "vue-json-csv";
import moment from "moment";

import { Report } from "../utils/frame";

export default {
    // name: 'ComponentName',
    components: {
        JsonCsv,
    },
    computed: {
        ...mapState("database", ["units", "settings"]),
        ...mapGetters("database", ["selectedReports"]),
        timeCalibrationState: {
            get() {
                return this.settings.timeCalibration;
            },
            set(value) {
                this.TOGGLE_TIME_CALIBRATION();
            },
        },
        exportedData() {
            return (
                this.selectedReports
                    // .reverse()
                    .map(({ data }) =>
                        data
                            .reverse()
                            .filter(({ chartable }) => chartable)
                            .reduce(
                                (carry, { field, value, output, unit }) => ({
                                    ...carry,
                                    [field]: output,
                                }),
                                {}
                            )
                    )
            );
        },
        exportedLabel() {
            return Report.reduce(
                (carry, { field, title, unit }) => ({
                    ...carry,
                    [field]: title + (unit ? ` (${unit})` : ""),
                }),
                {}
            );
        },
        exportedFilename() {
            return `tracking-${moment().format("YYYYMMDDHHmmss")}.csv`;
        },
    },
    methods: {
        ...mapMutations("database", ["TOGGLE_TIME_CALIBRATION"]),
        ...mapActions("database", ["RESET_DATABASE"]),
        clearStore() {
            this.$q
                .dialog({
                    title: "Confirmation",
                    message: `Are you sure to remove all data?`,
                    preventClose: true,
                    cancel: true,
                })
                .then(() => {
                    // clear all the store
                    this.RESET_DATABASE();
                    // reset command input
                    this.$root.$emit("setCommand", "");
                })
                .catch(() => {});
        },
        ignoreCommand() {
            this.$root.$emit("ignoreCommand");
        },
    },
};
</script>

<style></style>
