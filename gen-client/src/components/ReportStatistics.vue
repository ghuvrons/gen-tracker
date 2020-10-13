<template>
    <q-modal
        v-model="modalOpen"
        @show="statistics.render = true"
        @hide="stopRender()"
        :content-css="{ minWidth: '90vw', minHeight: '95vh' }"
    >
        <q-modal-layout>
            <q-toolbar slot="header">
                <q-btn
                    flat
                    round
                    dense
                    v-close-overlay
                    icon="keyboard_arrow_left"
                />
                <q-toolbar-title>
                    Report Statistics
                    <q-chip color="red" dense square v-if="chart.data">{{
                        chart.data.labels.length
                    }}</q-chip>
                </q-toolbar-title>
            </q-toolbar>

            <q-toolbar slot="footer">
                <q-toolbar-title class="q-pa-xs">
                    <q-btn
                        color="primary"
                        @click="modalOpen = false"
                        label="Close"
                    />
                </q-toolbar-title>
            </q-toolbar>

            <div class="layout-padding" v-if="statistics.render">
                <div class="row gutter-sm justify-between">
                    <div
                        :class="
                            statistics.field.field === 'eventsGroup'
                                ? 'col-sm-12 col-md-7 col-lg-8'
                                : 'col-12'
                        "
                    >
                        <line-chart
                            :styles="{
                                height: (height < 200 ? 200 : height) + 'px',
                            }"
                            :chart-data="chart.data"
                            :options="chart.options"
                            :update-data="statistics.update.data"
                            :update-options="statistics.update.options"
                        />
                        <q-range
                            v-model="range.value"
                            :min="range.min"
                            :max="range.max"
                            :disable="range.disable"
                            label
                            snap
                            square
                            label-always
                            :drag-range="range.control.drag"
                        />
                        <div
                            class="row justify-between items-center content-center"
                        >
                            <div class="col-auto">
                                <q-toggle
                                    v-model="range.control.beginAtZero"
                                    label="Begin Zero"
                                    class="q-ma-xs"
                                />
                                <q-toggle
                                    v-model="range.control.drag"
                                    label="Lock Sample"
                                    class="q-ma-xs"
                                    :disable="
                                        range.control.maximize ||
                                        chart.data.labels.length < sample.min
                                    "
                                />
                                <q-toggle
                                    v-model="range.control.follow"
                                    :disable="range.control.maximize"
                                    label="Follow Data"
                                    class="q-ma-xs"
                                />
                                <q-toggle
                                    v-model="range.control.maximize"
                                    label="Max Range"
                                    class="q-ma-xs"
                                />
                            </div>
                            <div class="col-auto">
                                <q-input
                                    v-model="range.sample"
                                    type="number"
                                    class="q-ma-xs"
                                    style="width: 130px"
                                    prefix="Sample :"
                                    inverted
                                    align="right"
                                    disable
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="statistics.field.field === 'eventsGroup'"
                        class="col-sm-12 col-md-5 col-lg-4"
                    >
                        <q-list dense>
                            <q-scroll-area
                                class="bg-white"
                                :style="{
                                    height:
                                        (height < 150 ? 150 : height) +
                                        110 +
                                        'px',
                                }"
                            >
                                <template
                                    v-for="(events,
                                    name) in selectedReportEvents"
                                >
                                    <q-collapsible
                                        :key="name"
                                        :label="`${name} `"
                                        :sublabel="`(${events.length}) times`"
                                        :header-class="`text-${
                                            activeEvent(name) ? 'green' : 'grey'
                                        }`"
                                        separator
                                        dense
                                    >
                                        <q-list dense>
                                            <q-item
                                                v-for="event in events"
                                                :key="`${name}-${event.seqID}`"
                                                separator
                                                dense
                                            >
                                                <q-item-main>
                                                    <q-item-tile sublabel>
                                                        {{ event.seqID }}
                                                    </q-item-tile>
                                                </q-item-main>
                                            </q-item>
                                        </q-list>
                                    </q-collapsible>
                                </template>
                            </q-scroll-area>
                        </q-list>
                    </div>
                </div>
            </div>
        </q-modal-layout>
    </q-modal>
</template>

<script>
import { mapGetters } from "vuex";
const Long = require("long");

import { Events } from "../utils/events";

import LineChart from "components/LineChart";

export default {
    props: {
        data: Object,
        height: Number,
    },
    components: {
        LineChart,
    },
    data() {
        return {
            events: this.$_.cloneDeep(Events),
            currentValue: 0,
            modalOpen: false,
            sample: {
                min: 10,
                lastValue: 0,
                lastDragState: false,
            },
            range: {
                control: {
                    beginAtZero: true,
                    follow: true,
                    maximize: false,
                    drag: true,
                },
                disable: false,
                sample: 10,
                min: 0,
                max: 10,
                value: {
                    min: 0,
                    max: 10,
                },
            },
            statistics: {
                render: false,
                field: null,
                update: {
                    data: false,
                    options: false,
                },
            },
            chart: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            label: "",
                            backgroundColor: "#f87979",
                            fill: true,
                            showLine: true,
                            pointRadius: 2,
                        },
                    ],
                },
                options: {
                    animation: {
                        duration: 10,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: true,
                        align: "end",
                    },
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    max: 1,
                                    min: 0,
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: "Sequential ID",
                                },
                            },
                        ],
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    max: 1,
                                    min: 0,
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: "Value",
                                },
                            },
                        ],
                    },
                },
            },
        };
    },
    computed: {
        ...mapGetters("database", ["selectedReports", "selectedReportEvents"]),
    },
    methods: {
        activeEvent(name) {
            let bit = Events.find(({ name: _name }) => _name === name).bit;
            return Long.fromNumber(this.currentValue, 1).shiftRight(bit) & 1;
        },
        changeChartData({ yData, xData, yLabel, title }) {
            this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
            this.chart.data.labels = xData;
            this.chart.data.datasets[0].data = yData;
            this.chart.data.datasets[0].label = title;

            // trigger update
            this.statistics.update.data = !this.statistics.update.data;
        },
        changeChartOptions({ xMin, xMax, beginAtZero }) {
            let data = this.chart.data.datasets[0].data;
            let labels = this.chart.data.labels;
            // if null, set default
            xMin = xMin || this.range.value.min;
            xMax = xMax || this.range.value.max;
            beginAtZero = beginAtZero || this.range.control.beginAtZero;
            // find the index
            let minIndex = labels.findIndex((val) => val >= xMin);
            let maxIndex = labels.findIndex((val) => val >= xMax);
            // sometime the sequentialID is corrupt, so set the nearest greater value
            xMin = labels[minIndex];
            xMax = labels[maxIndex];
            // update value
            this.currentValue = data[maxIndex];
            // calculate y-axes
            let dataInRange = data.filter(
                (_, i) => i >= minIndex && i <= maxIndex
            );
            let yMax = this.$_.max(dataInRange);
            let yMin = this.range.control.beginAtZero
                ? 0
                : this.$_.min(dataInRange);
            // set yMax always greate+1 than yMin
            if (yMax <= yMin) {
                yMax = yMin + 1;
            }
            // apply corrected value
            this.chart.options.scales.xAxes[0].ticks.max = xMax;
            this.chart.options.scales.xAxes[0].ticks.min = xMin;
            this.chart.options.scales.yAxes[0].ticks.max = yMax;
            this.chart.options.scales.yAxes[0].ticks.min = yMin;
            this.chart.options.scales.yAxes[0].ticks.beginAtZero = beginAtZero;
            // trigger update
            this.statistics.update.options = !this.statistics.update.options;
        },
        readReportStatistics(dataField) {
            this.statistics.field = dataField;
            // build the datasets
            this.buildReportStatistics();
            // calculate min
            let min = this.range.min;
            if (!this.range.control.maximize) {
                if (this.chart.data.labels.length >= this.range.sample) {
                    min = this.range.max - this.range.sample;
                }
            }
            // set initial range value
            this.range.value = {
                max: this.range.max,
                min,
            };
            // open the chart
            this.modalOpen = true;
        },
        buildReportStatistics() {
            // reset chart
            let datasets = [];
            let labels = [];
            // get datasets
            this.selectedReports.forEach(({ data }) => {
                let theField = data.find(
                    ({ field }) => field === this.statistics.field.field
                );
                // is data-field exist on this report
                if (theField) {
                    // insert to datasets
                    datasets.push(theField.value);
                    // insert the label
                    let sequentialID = data.find(
                        ({ field }) => field === "sequentialID"
                    ).value;
                    labels.push(sequentialID);
                    // labels.push(datasets.length)
                }
            });
            // update the datasets
            this.changeChartData({
                xData: labels.reverse(),
                yData: datasets.reverse(),
                yLabel: this.statistics.field.unit || "Value",
                title: this.statistics.field.title,
            });
            // set range (always update on data change)
            this.range.min = this.$_.min(labels);
            this.range.max = this.$_.max(labels);
        },
        stopRender() {
            this.statistics.render = false;
            this.$emit("close");
        },
    },
    watch: {
        data: {
            immediate: true,
            handler(data) {
                if (data) {
                    // show the modal
                    if (data.chartable && this.selectedReports.length > 1) {
                        this.readReportStatistics(data);
                    }
                }
            },
        },
        selectedReports: {
            immediate: true,
            handler(val) {
                if (this.statistics.render) {
                    // update datasets
                    this.buildReportStatistics();
                    // update follow data
                    if (this.range.control.follow) {
                        let min = this.range.value.min;
                        let sample = this.range.max - this.range.min;
                        // set drag to true if sample less than sample.min
                        if (!(sample > this.sample.min + 1)) {
                            this.range.control.drag = sample > this.sample.min;
                        }
                        // update min on range.control.drag
                        if (this.range.control.drag) {
                            // update min value on range.control.drag
                            min = this.range.max - this.range.sample;
                        }

                        // update chart range value
                        this.range.value = {
                            max: this.range.max,
                            min,
                        };
                    }
                }
            },
        },
        "range.control.maximize": {
            immediate: true,
            handler(state) {
                let max = this.range.max;
                let min = this.range.min;
                let sample = max - min;
                // check state
                if (state) {
                    // save previous sample value
                    this.sample.lastValue = this.range.sample;
                    // save previous drag state
                    this.sample.lastDragState = this.range.control.drag;
                    // enable drag
                    this.range.control.drag = false;
                    // follow data enable
                    this.range.control.follow = true;
                } else {
                    // retrieve previous drag state
                    this.range.control.drag = this.sample.lastDragState;
                    // retrieve previous sample value
                    if (this.sample.lastValue > this.sample.min) {
                        sample = this.sample.lastValue;
                    } else {
                        // set default sample
                        if (sample > this.sample.min) {
                            sample = this.sample.min;
                        }
                    }
                }
                // the range bar
                this.range.disable = state;
                // update range value
                this.range.value = {
                    max,
                    min: max - sample,
                };
            },
        },
        "range.value": {
            immediate: true,
            deep: true,
            handler({ min, max }) {
                // update sample
                this.range.sample = max - min;
                // update chart
                this.changeChartOptions({
                    xMin: min,
                    xMax: max,
                });
            },
        },
        "range.control.beginAtZero": {
            immediate: true,
            handler(beginAtZero) {
                this.changeChartOptions({
                    beginAtZero,
                });
            },
        },
    },
};
</script>

<style></style>
