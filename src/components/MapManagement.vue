<template>
  <q-splitter :model-value="streetView ? 50 : 100">
    <!--
        we listen for size changes on this next
        <div>, so we place the observer as direct child:
      -->
    <q-resize-observer @resize="width = $event.width" />
    <template v-slot:before>
      <GoogleMap
        api-key="AIzaSyBE8UhrrFkz9m37oowPkHX9to8NXcHw4Ak"
        class="fit"
        ref="gmap"
        :center="center"
        :zoom="zoom"
      >
        <Marker
          v-if="position.valid"
          :options="{ position: center, icon }"
        />
        <Polyline :options="{ path, ...polyOptions }" />
      </GoogleMap>
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
      <!-- <gmap-street-view-panorama
        class="fit"
        :position="position"
        :pov="pov"
        :zoom="1"
        @pano_changed="updatePano"
        @pov_changed="updatePov"
      ></gmap-street-view-panorama> -->
    </template>
  </q-splitter>
</template>

<script>
import config from "src/js/opt/config";
import { nearestFullReport } from "src/js/report";
import { getPosition, getHeading } from "src/js/map";
import { frameId } from "src/js/utils";

import { GoogleMap, Marker, Polyline } from "vue3-google-map";
import {
  reactive,
  toRefs,
  watch,
  computed,
  defineComponent,
  onMounted
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  // name: 'ComponentName',
  components: { GoogleMap, Marker, Polyline },
  setup(props) {
    const store = useStore();
    const report = computed(() => store.state.db.report);
    const devDevice = computed(() => store.getters[`db/devDevice`]);
    const devReports = computed(() => store.getters[`db/devReports`]);

    const { protocol, host } = window.location;
    const { centerIndonesia, zoom } = config.map;
    const state = reactive({
      zoom,
      gmap: null,
      width: 0,
      icon: {
        // url: `${protocol}//${host}/motorcycle.png`,
        path: "M16.001 5c-4.216 0-7.714 3.418-7.634 7.634.029 1.578.719 2.824 1.351 4.024.242.461 6.264 10.332 6.264 10.332V27l.001-.007.002.007v-.01l6.531-10.377c.407-.703.793-1.771.793-1.771A7.631 7.631 0 0 0 16.001 5zM16 16.019a3.895 3.895 0 0 1-3.896-3.897A3.898 3.898 0 1 1 16 16.019z",
        rotation: 0-180,
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 0.3,
        anchor:{x:16, y:28},
      },
      // pov: null,
      // pano: null,
      path: [],
      center: {
        ...centerIndonesia
      },
      position: {
        ...centerIndonesia,
        valid: false
      },
      polyOptions: {
        geodesic: true,
        strokeColor: '#F88',
        strokeOpacity: 0.75,
        strokeWeight: 2
      },
      // options: {
      //   zoomControl: true,
      //   mapTypeControl: false,
      //   scaleControl: true,
      //   streetViewControl: false,
      //   rotateControl: false,
      //   fullscreenControl: true,
      //   disableDefaultUi: true
      // }
    });

    const streetView = computed(
      () => false // state.position.valid && state.width > 500
    );

    // const updatePov = (pov) => (state.pov = { ...pov, zoom: 0 });
    // const updatePano = (pano) => (state.pano = pano);
    const setPosition = ({ valid, ...location }) => {
      state.zoom = valid ? 17 : zoom;
      state.center = { ...(valid ? location : centerIndonesia) };
      state.position = { ...location, valid };
    };
    const addPath = (report) => {
      const pos = getPosition(report);
      if (pos.valid) state.path.push(pos);
    };

    watch(
      () => devDevice.value,
      (curDev, oldDev) => {
        if (curDev?.vin != oldDev?.vin) {
          state.path = [];
          devReports.value
            .filter(({ frameID }) => frameId(frameID.val) == "FULL")
            .forEach((report) => addPath(report));
        } else {
          addPath(curDev?.lastFullReport);
        }
      },
      { lazy: false, immediate: true, deep: true }
    );

    watch(
      () => report.value,
      (curReport, oldReport) => {
        const fullFrame = frameId(curReport?.frameID?.val) == "FULL";
        const fullReport = fullFrame
          ? curReport
          : nearestFullReport(curReport, devReports.value);

        setPosition(getPosition(fullReport));
        state.icon.rotation = getHeading(curReport) - 180;

        // if (state.pov)
        //   updatePov({
        //     ...state.pov,
        //     heading: getHeading(curReport)
        //   });
      },
      { lazy: false, immediate: true }
    );

    return {
      ...toRefs(state),
      streetView,

      // updatePov,
      // updatePano
    };
  }
});
</script>

<style>
</style>
