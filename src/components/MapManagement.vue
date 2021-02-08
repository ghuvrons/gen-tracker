<template>
  <q-splitter :value="showStreetView ? 50 : 100">
    <template v-slot:before>
      <gmap-map class="fit" :center="center" :zoom="zoom" :options="options" map-type-id="roadmap">
        <gmap-marker v-if="position.valid" :position="position"></gmap-marker>
        <gmap-polyline v-if="path.length > 0" :path="path" ref="polyline"></gmap-polyline>
      </gmap-map>
    </template>
    <template v-if="showStreetView" v-slot:separator>
      <q-avatar color="grey" text-color="white" size="20px" icon="drag_indicator" />
    </template>
    <template v-if="showStreetView" v-slot:after>
      <gmap-street-view-panorama
        class="fit"
        :position="position"
        :pov="pov"
        :zoom="1"
        @pano_changed="updatePano"
        @pov_changed="updatePov"
      ></gmap-street-view-panorama>
    </template>
  </q-splitter>
</template>

<script>
import { genPosition, getHeading } from "components/js/map";
import config from "components/js/opt/config";
import { devReports } from "src/store/db/getter-types";
import { mapState, mapGetters } from "vuex";

export default {
  // name: 'ComponentName',
  data() {
    return {
      center: { ...config.map.centerIndonesia },
      position: {
        ...config.map.centerIndonesia,
        valid: false,
      },
      zoom: config.map.zoom,
      pov: null,
      pano: null,
      path: [],
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: true,
      },
    };
  },
  computed: {
    ...mapState("db", ["report"]),
    ...mapGetters("db", [devReports]),
    showStreetView() {
      return this.$q.screen.gt.xs;
    },
  },
  methods: {
    updatePov(pov) {
      this.pov = pov;
    },
    updatePano(pano) {
      this.pano = pano;
    },
    setPosition({ valid, ...location }) {
      if (valid) {
        this.zoom = 17;
        this.center = { ...location };
      } else {
        this.zoom = config.map.zoom;
        this.center = { ...config.map.centerIndonesia };
      }
      this.position = { ...location, valid };
    },
  },
  watch: {
    devReports: {
      immediate: true,
      handler(devReports) {
        if (devReports.length == 0) return;
        let { frameID, gpsLatitude, gpsLongitude } = devReports[0];
        let pos = genPosition({
          frameID: frameID.val,
          lat: gpsLatitude && gpsLatitude.val,
          lng: gpsLongitude && gpsLongitude.val,
        });

        if (!pos.valid) return;

        this.path.push(pos);
      },
    },
    report: {
      immediate: true,
      handler(report) {
        if (!report) return;

        let { frameID, gpsLatitude, gpsLongitude, gpsHeading } = report;
        this.setPosition(
          genPosition({
            frameID: frameID.val,
            lat: gpsLatitude && gpsLatitude.val,
            lng: gpsLongitude && gpsLongitude.val,
          })
        );

        if (!this.pov) return;
        this.updatePov({
          ...this.pov,
          heading: getHeading({
            frameID: frameID.val,
            heading: gpsHeading && gpsHeading.val,
          }),
        });
      },
    },
  },
};
</script>

<style>
</style>
