<template>
    <div class="row" :style="{ height: height + 'px' }">
        <div class="col-xs-12" :class="{ 'col-sm-6': showStreetView }">
            <gmap-map
                class="fit"
                :center="centerPosition"
                :zoom="zoom"
                map-type-id="roadmap"
            >
                <gmap-marker
                    v-if="!position.error"
                    :position="position"
                ></gmap-marker>
                <gmap-polyline
                    v-if="path.length"
                    :path="path"
                    ref="polyline"
                ></gmap-polyline>
            </gmap-map>
        </div>

        <div v-if="showStreetView" class="col-xs-12 col-sm-6">
            <gmap-street-view-panorama
                class="fit"
                :position="position"
                :pov="pov"
                :zoom="1"
                @pano_changed="updatePano"
                @pov_changed="updatePov"
            ></gmap-street-view-panorama>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
    // name: 'ComponentName',
    props: {
        height: Number,
        pageWidth: Number,
    },
    created() {
        this.zoom = this.$_.cloneDeep(this.config.map.zoom);
        this.centerPosition = this.$_.cloneDeep(
            this.config.map.centerIndonesia
        );
        this.position = {
            ...this.$_.cloneDeep(this.config.map.centerIndonesia),
            error: true,
        };
    },
    data() {
        return {
            zoom: 0,
            centerPosition: null,
            position: null,
            path: [],
            pov: null,
            pano: null,
        };
    },
    computed: {
        ...mapState("database", ["theReport", "config"]),
        ...mapGetters("database", ["selectedReports"]),
        showStreetView() {
            return this.pageWidth >= 728;
        },
    },
    methods: {
        updatePov(pov) {
            this.pov = pov;
        },
        updatePano(pano) {
            this.pano = pano;
        },
        generatePosition(report) {
            let pos = {
                ...this.$_.cloneDeep(this.config.map.centerIndonesia),
                error: true,
            };

            if (report) {
                if (report.frameID === this.config.frame.id.FULL) {
                    pos.lng = report.data.find(
                        ({ field }) => field === "gpsLongitude"
                    ).value;
                    pos.lat = report.data.find(
                        ({ field }) => field === "gpsLatitude"
                    ).value;
                    pos.error = !this.isIndonesia(pos);
                }
            }

            return pos;
        },
        setPosition({ lng, lat, error }) {
            // update position
            if (!error) {
                this.zoom = 17;
                this.centerPosition = { lng, lat };
            } else {
                this.zoom = this.$_.cloneDeep(this.config.map.zoom);
                this.centerPosition = this.$_.cloneDeep(
                    this.config.map.centerIndonesia
                );
            }
            this.position = { lng, lat, error };
        },
        setPath(reports) {
            // reset map
            this.path = [];
            if (reports.length) {
                // set the path
                reports.forEach((report) => {
                    let frameID = report.data.find(
                        ({ field }) => field === "frameID"
                    ).value;
                    // only handle gps on full frame
                    if (frameID === this.config.frame.id.FULL) {
                        let { lng, lat, error } = this.generatePosition(report);
                        // add path (valid area only)
                        if (!error) {
                            this.path.push({ lng, lat, error });
                        }
                    }
                });
                // set the position
                this.setPosition(this.generatePosition(this.theReport));
            }
        },
        isIndonesia({ lng, lat }) {
            if (
                lng > this.config.map.borderIndonesia.lngMin &&
                lng < this.config.map.borderIndonesia.lngMax &&
                lat > this.config.map.borderIndonesia.latMin &&
                lat < this.config.map.borderIndonesia.latMax
            ) {
                return true;
            }
            return false;
        },
    },
    watch: {
        theReport: {
            immediate: true,
            handler(report) {
                this.setPosition(this.generatePosition(report));
            },
        },
        selectedReports: {
            immediate: true,
            handler(reports) {
                this.setPath(reports);
            },
        },
    },
};
</script>

<style>
</style>
