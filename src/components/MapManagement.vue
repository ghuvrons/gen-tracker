<template>
  <q-splitter :value="streetView ? 50 : 100">
    <!--
        we listen for size changes on this next
        <div>, so we place the observer as direct child:
      -->
    <q-resize-observer @resize="onResize" />
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
    <template v-if="streetView" v-slot:separator>
      <q-avatar
        color="grey"
        text-color="white"
        size="20px"
        icon="drag_indicator"
      />
    </template>
    <template v-if="streetView" v-slot:after>
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

import { get } from "lodash";
import { reactive, toRefs, watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useGetters } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  setup(props) {
    const { report } = useState(["report"]);
    const { devDevice } = useGetters(["devDevice"]);

    const { centerIndonesia, zoom } = config.map;
    const state = reactive({
      streetView: false,
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

    const updatePov = pov => (state.pov = pov);
    const updatePano = pano => (state.pano = pano);
    const setPosition = ({ valid, ...location }) => {
      state.zoom = valid ? 17 : zoom;
      state.center = { ...(valid ? location : centerIndonesia) };
      state.position = { ...location, valid };
    };
    const onResize = ({ width }) => (state.streetView = width > 500);

    watch(
      () => devDevice.value,
      dev => {
        const lastReport = get(dev, "lastReport");
        if (!lastReport) return;

        let pos = getPosition(lastReport);
        if (pos.valid) state.path.push(pos);
      },
      { lazy: false, deep: true }
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

      updatePov,
      updatePano,
      onResize
    };
  }
};
</script>

<style>
</style>
