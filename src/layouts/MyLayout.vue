<template>
  <q-layout view="lHr LpR lFr">
    <!--can be placed anywhere within your template -->
    <q-header>
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round @click="drawerOpen.left = !drawerOpen.left">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ $config.app.title }}
          <div slot="subtitle">
            v.{{ $config.app.version }} &copy; {{ $config.app.subTitle }}
          </div>
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          v-if="$q.fullscreen.isCapable"
          @click="$q.fullscreen.toggle()"
        >
          <q-icon
            :name="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          />
        </q-btn>

        <q-btn flat dense round @click="drawerOpen.right = !drawerOpen.right">
          <q-icon name="apps" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen.left" :content-class="darkerClass" bordered>
      <unit-management :height="height.top"></unit-management>
      <report-reader :height="height.bottom - 72"></report-reader>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="drawerOpen.right"
      :content-class="darkerClass"
      bordered
    >
      <command-management></command-management>
      <response-log :height="height.bottom - 73"></response-log>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import ReportReader from "components/ReportReader";
import UnitManagement from "components/UnitManagement";
import ResponseLog from "components/ResponseLog";
import CommandManagement from "components/CommandManagement";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  name: "MyLayout",
  mixins: [CommonMixin],
  components: {
    ReportReader,
    UnitManagement,
    ResponseLog,
    CommandManagement,
  },
  data() {
    return {
      drawerOpen: {
        left: this.$q.platform.is.desktop,
        right: false,
      },
      height: {
        top: 90,
        bottom: 0,
      },
    };
  },
  methods: {
    onResize(height) {
      this.height.bottom = height - this.height.top;
    },
  },
  watch: {
    "$q.screen.height": {
      immediate: true,
      handler(h) {
        this.onResize(h);
      },
    },
  },
};
</script>

<style></style>
