<template>
  <q-layout view="lHr LpR lFr">
    <q-header elevated>
      <offline-banner></offline-banner>
      <q-toolbar class="bg-primary text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer.left = !drawer.left"
        ></q-btn>

        <q-toolbar-title>
          {{ app.title }}
          <q-item-label class="text-white" caption>
            {{ app.subTitle }} v.{{ app.version }}
          </q-item-label>
        </q-toolbar-title>

        <q-btn @click="reload()" icon="refresh" flat dense round></q-btn>

        <q-btn
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          flat
          dense
          round
        ></q-btn>

        <q-btn
          flat
          dense
          round
          icon="more_vert"
          @click="drawer.right = !drawer.right"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer.left" show-if-above bordered>
      <q-splitter v-model="splitter" style="height: 100vh" unit="px" horizontal>
        <template v-slot:before>
          <device-management :height="hDeviceManagement"></device-management>
        </template>
        <template v-slot:separator>
          <q-avatar
            color="grey"
            text-color="white"
            size="20px"
            icon="drag_indicator"
          />
        </template>
        <template v-slot:after>
          <report-reader :height="splitter"></report-reader>
        </template>
      </q-splitter>
    </q-drawer>

    <q-drawer side="right" v-model="drawer.right" show-if-above bordered>
      <command-management
        v-model="payload"
        :style="`height: ${hCommandManagement}`"
      ></command-management>
      <response-log
        @select="payload = $event"
        :height="hResponseLog"
      ></response-log>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import ReportReader from "components/ReportReader";
import DeviceManagement from "components/DeviceManagement";
import ResponseLog from "components/ResponseLog";
import CommandManagement from "components/CommandManagement";

import config from "src/data/config";

import { SET_DARKER } from "src/store/common/mutation-types";

import { useQuasar } from "quasar";
import { computed, reactive, toRefs, watch, onMounted} from "vue";
import { useStore } from "vuex";
import OfflineBanner from 'src/components/etc/OfflineBanner.vue';

export default {
  // name: "MyLayout",
  components: {
    OfflineBanner,
    ReportReader,
    DeviceManagement,
    ResponseLog,
    CommandManagement
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const darker = computed(() => store.state.common.darker);
    const setDarker = (v) => store.commit(SET_DARKER, v);

    const state = reactive({
      drawer: {
        left: $q.platform.is.desktop,
        right: $q.screen.lg
      },
      app: config.app,
      splitter: 150,
      payload: null
    });

    const hCommandManagement = computed(() => `120px`);
    const hResponseLog = computed(
      () => `calc(100vh - ${hCommandManagement.value} - 33px)`
    );
    const hDeviceManagement = computed(
      () => `calc(${state.splitter}px - 32px)`
    );

    const reload = () => window.location.reload();

    watch(
      () => $q.dark.isActive,
      (v) => setDarker(v)
    );

    onMounted(() => $q.dark.set(darker.value));

    return {
      ...toRefs(state),

      hCommandManagement,
      hResponseLog,
      hDeviceManagement,

      reload
    };
  }
};
</script>

<style></style>
