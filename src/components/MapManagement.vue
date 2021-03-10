<template>
  <q-splitter :mode-value="streetView ? 50 : 100">
    <!--
        we listen for size changes on this next
        <div>, so we place the observer as direct child:
      -->
    <q-resize-observer @resize="width = $event.width" />
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
import { nearestFullReport } from "src/js/report";
import { getPosition, getHeading } from "src/js/map";
import { frameId } from "src/js/utils";

import { get } from "lodash";
import { reactive, toRefs, watch, computed } from "vue";
import { createNamespacedHelpers } from "vuex";
const { useState, useGetters } = createNamespacedHelpers("db");

export default {
  // name: 'ComponentName',
  setup(props) {
    const { report } = useState(["report"]);
    const { devDevice, devReports } = useGetters(["devDevice", "devReports"]);

    const { centerIndonesia, zoom } = config.map;
    const state = reactive({
      width: 0,
      pov: null,
      pano: null,
      path: [],
      zoom,
      center: {
        ...centerIndonesia,
      },
      position: {
        ...centerIndonesia,
        valid: false,
      },
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: true,
      },
    });

    const updatePov = (pov) => (state.pov = { ...pov, zoom: 0 });
    const updatePano = (pano) => (state.pano = pano);
    const setPosition = ({ valid, ...location }) => {
      state.zoom = valid ? 17 : zoom;
      state.center = { ...(valid ? location : centerIndonesia) };
      state.position = { ...location, valid };
    };

    const streetView = computed(
      () => state.position.valid && state.width > 500
    );

    watch(
      () => devDevice.value,
      (curDev, oldDev) => {
        if (get(curDev, "unitID") != get(oldDev, "unitID")) state.path = [];
        else {
          const fullReport = get(curDev, "lastFullReport");
          const pos = getPosition(fullReport);
          if (pos.valid) state.path.push(pos);
        }
      },
      { lazy: false, immediate: true, deep: true }
    );

    watch(
      () => report.value,
      (curReport, oldReport) => {
        const fullFrame = frameId(get(curReport, "frameID.val")) == "FULL";
        const fullReport = fullFrame
          ? curReport
          : nearestFullReport(curReport, devReports.value);

        const pos = getPosition(fullReport);
        setPosition(pos);

        if (get(curReport, "unitID.val") != get(oldReport, "unitID.val"))
          setPosition(pos);
        else if (pos.valid) setPosition(pos);

        if (state.pov)
          updatePov({
            ...state.pov,
            heading: getHeading(curReport),
          });
      },
      { lazy: false, immediate: true }
    );

    return {
      ...toRefs(state),
      streetView,

      updatePov,
      updatePano,
    };
  },
};
</script>

<style>
</style>
