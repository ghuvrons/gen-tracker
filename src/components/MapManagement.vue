<template>
  <q-splitter :value="showPano ? 50 : 100">
    <template v-slot:before>
      <gmap-map
        class="fit"
        :center="center"
        :zoom="zoom"
        :options="options"
        map-type-id="roadmap"
      >
        <gmap-marker v-if="position.valid" :position="position"></gmap-marker>
        <gmap-polyline
          v-if="path.length > 0"
          :path="path"
          ref="polyline"
        ></gmap-polyline>
      </gmap-map>
    </template>
    <template v-if="showPano" v-slot:separator>
      <q-avatar
        color="grey"
        text-color="white"
        size="20px"
        icon="drag_indicator"
      />
    </template>
    <template v-if="showPano" v-slot:after>
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
import config from "src/js/opt/config";
import { getPosition, getHeading } from "src/js/map";
import { Screen } from "quasar";

import { reactive, toRefs, computed, watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default {
  // name: 'ComponentName',
  setup(props) {
    const { useState, useGetters } = createNamespacedHelpers("db");
    const { report } = useState(["report"]);
    const { devReports } = useGetters(["devReports"]);

    const { centerIndonesia, zoom } = config.map;
    const state = reactive({
      pov: null,
      pano: null,
      path: [],
      zoom,
      center: {
        ...centerIndonesia
      },
      position: {
        ...centerIndonesia,
        valid: false
      },
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: true
      }
    });

    const showPano = computed(() => Screen.gt.xs);

    const updatePov = pov => (state.pov = pov);
    const updatePano = pano => (state.pano = pano);
    const setPosition = ({ valid, ...location }) => {
      state.zoom = valid ? 17 : zoom;
      state.center = { ...(valid ? location : centerIndonesia) };
      state.position = { ...location, valid };
    };

    watch(
      () => devReports.value[0],
      devReport => {
        if (!devReport) return;

        let pos = getPosition(devReport);
        if (pos.valid) state.path.push(pos);
      },
      { lazy: false }
    );

    watch(
      () => report.value,
      report => {
        if (!report) return;
        setPosition(getPosition(report));

        if (!state.pov) return;
        updatePov({
          ...state.pov,
          heading: getHeading(report)
        });
      },
      { lazy: false }
    );

    return {
      ...toRefs(state),
      showPano,

      updatePov,
      updatePano
    };
  }
};
</script>

<style>
</style>
