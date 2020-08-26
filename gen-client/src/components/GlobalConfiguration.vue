<template>
    <div class="row justify-between items-center" style="height: 150px;">
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
            <q-toggle
                v-model="timeCalibrationState"
                label="Time Calibration"
                class="q-ma-xs"
            />
        </div>
        <div class="col-auto">
            <q-toggle
                v-model="combineCommand"
                label="Combine Command"
                class="q-ma-xs"
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
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
    // name: 'ComponentName',
    computed: {
        ...mapState("database", ["units", "settings", "combineCmd"]),
        combineCommand: {
            get() {
                return this.combineCmd;
            },
            set(value) {
                this.TOGGLE_COMBINE_CMD();
            },
        },
        timeCalibrationState: {
            get() {
                return this.settings.timeCalibration;
            },
            set(value) {
                this.TOGGLE_TIME_CALIBRATION();
            },
        },
    },
    methods: {
        ...mapMutations("database", [
            "TOGGLE_COMBINE_CMD",
            "TOGGLE_TIME_CALIBRATION",
        ]),
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
