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
        :center="center"
        :zoom="zoom"
      >
        <Marker v-if="position.valid" :options="{ position: center }" />
        <Polyline :options="polyOptions" />
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
import { get } from "lodash";
import { reactive, toRefs, watch, computed, defineComponent } from "vue";
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
      width: 0,
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
    const polyOptions = computed(() => ({
      path: state.path,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    }));

    watch(
      () => devDevice.value,
      (curDev, oldDev) => {
        if (get(curDev, "unitID") != get(oldDev, "unitID")) {
          state.path = [];
        } else {
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
            heading: getHeading(curReport)
          });
      },
      { lazy: false, immediate: true }
    );

    return {
      ...toRefs(state),
      streetView,
      polyOptions,

      updatePov,
      updatePano
    };
  }
});
</script>

<style>
</style>
