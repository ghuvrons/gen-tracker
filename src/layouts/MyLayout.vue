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
          <q-item-label class="text-white" caption>
            {{ $config.app.subTitle }} v.{{ $config.app.version }}
          </q-item-label>
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
          <q-icon name="more_vert" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen.left" :content-class="darkerClass" bordered>
      <q-splitter :value="150" style="height: 100vh" unit="px" horizontal>
        <template v-slot:before>
          <unit-management></unit-management>
        </template>
        <template v-slot:after>
          <report-reader></report-reader>
        </template>
      </q-splitter>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="drawerOpen.right"
      :content-class="darkerClass"
      bordered
    >
      <q-splitter :value="128" style="height: 100vh" unit="px" horizontal>
        <template v-slot:before>
          <command-management></command-management>
        </template>
        <template v-slot:after>
          <response-log></response-log>
        </template>
      </q-splitter>
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
    };
  },
};
</script>

<style></style>
