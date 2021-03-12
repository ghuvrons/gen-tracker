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
        <Marker
          v-if="position.valid"
          :options="{ position: center, icon: icon }"
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
import { get } from "lodash";
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

    const { centerIndonesia, zoom } = config.map;
    const state = reactive({
      zoom,
      width: 0,
      icon: null,
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
        strokeColor: '#000',
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

    const streetView = computed(
      () => false // state.position.valid && state.width > 500
    );

    onMounted(() => {
      const { protocol, host } = window.location;
      state.icon = `${protocol}//${host}/motorcycle.png`;
    });

    watch(
      () => devDevice.value,
      (curDev, oldDev) => {
        if (get(curDev, "unitID") != get(oldDev, "unitID")) {
          state.path = [];
          devReports.value
            .filter(({ frameID }) => frameId(frameID.val) == "FULL")
            .forEach((report) => addPath(report));
        } else {
          const report = get(curDev, "lastFullReport");
          addPath(report);
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

        // if (get(curReport, "unitID.val") != get(oldReport, "unitID.val"))
        //   setPosition(pos);
        // else if (pos.valid) setPosition(pos);

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
