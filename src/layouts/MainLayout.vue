<template>
  <q-layout view="lHr LpR lFr">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer.left = !drawer.left"></q-btn>

        <q-toolbar-title>
          {{ $config.app.title }}
          <q-item-label
            class="text-white"
            caption
          >{{ $config.app.subTitle }} v.{{ $config.app.version }}</q-item-label>
        </q-toolbar-title>

        <q-btn
          v-if="$q.fullscreen.isCapable"
          @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          flat
          dense
          round
        ></q-btn>

        <q-btn
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          flat
          dense
          round
        ></q-btn>

        <q-btn flat dense round icon="more_vert" @click="drawer.right = !drawer.right"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer.left" show-if-above bordered>
      <q-splitter v-model="splitter" style="height: 100vh" unit="px" horizontal>
        <template v-slot:before>
          <device-management :height="splitter"></device-management>
        </template>
        <template v-slot:separator>
          <q-avatar color="grey" text-color="white" size="20px" icon="drag_indicator" />
        </template>
        <template v-slot:after>
          <report-reader :height="splitter"></report-reader>
        </template>
      </q-splitter>
    </q-drawer>

    <q-drawer side="right" v-model="drawer.right" show-if-above bordered>
      <command-management style="height: 120px"></command-management>
      <response-log :height="120"></response-log>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { SET_DARKER } from "src/store/db/mutation-types";
import { mapState, mapMutations } from "vuex";
import ReportReader from "components/ReportReader";
import DeviceManagement from "components/DeviceManagement";
import ResponseLog from "components/ResponseLog";
import CommandManagement from "components/CommandManagement";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  name: "MyLayout",
  mixins: [CommonMixin],
  components: {
    ReportReader,
    DeviceManagement,
    ResponseLog,
    CommandManagement,
  },
  data() {
    return {
      drawer: {
        left: this.$q.platform.is.desktop,
        right: false,
      },
      splitter: 150,
    };
  },
  computed: {
    ...mapState("db", ["darker"]),
  },
  methods: {
    ...mapMutations("db", [SET_DARKER]),
  },
  mounted() {
    this.$q.dark.set(this.darker);
  },
  watch: {
    "$q.dark.isActive": function (v) {
      this.SET_DARKER(v);
    },
  },
};
</script>

<style></style>
