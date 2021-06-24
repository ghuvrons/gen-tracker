<template>
  <GoogleMap
    class="fit"
    :api-key="apiKey"
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

<script>
import config from "src/data/config";
// import { nearestFullReport } from "src/js/report";
import { getPosition, getHeading } from "src/js/map";
import { frameId } from "src/js/utils";

import { GoogleMap, Marker, Polyline } from "vue3-google-map";
import {
  reactive,
  toRefs,
  watch,
  computed,
  defineComponent,
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

    const { centerIndonesia, zoom } = config.map;
    const state = reactive({
      zoom,
      icon: {
        path: "M16.001 5c-4.216 0-7.714 3.418-7.634 7.634.029 1.578.719 2.824 1.351 4.024.242.461 6.264 10.332 6.264 10.332V27l.001-.007.002.007v-.01l6.531-10.377c.407-.703.793-1.771.793-1.771A7.631 7.631 0 0 0 16.001 5zM16 16.019a3.895 3.895 0 0 1-3.896-3.897A3.898 3.898 0 1 1 16 16.019z",
        rotation: 0-180,
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 0.3,
        anchor:{x:16, y:28},
      },
      path: [],
      center: {...centerIndonesia},
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
            .filter(({ gpsActive }) => gpsActive?.val)
            .forEach((report) => addPath(report));
        } else {
          addPath(curDev?.lastReport);
        }
      },
      { immediate: true, deep: true }
    );

    watch(
      () => report.value,
      (curReport) => {
        // const fullFrame = frameId(curReport?.frameID?.val) == "FULL";
        // const fullReport = fullFrame
        //   ? curReport
        //   : nearestFullReport(curReport, devReports.value);

        setPosition(getPosition(curReport));
        state.icon.rotation = getHeading(curReport) - 180;
      },
      { immediate: true }
    );

    return {
      ...toRefs(state),
      apiKey: config.map.apiKey
    };
  }
});
</script>

<style>
</style>
