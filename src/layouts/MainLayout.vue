<template>
  <q-layout view="lHr LpR lFr">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerOpen.left = !drawerOpen.left"
        >
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
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          v-if="$q.fullscreen.isCapable"
          @click="$q.fullscreen.toggle()"
        >
        </q-btn>

        <q-btn
          flat
          dense
          round
          icon="more_vert"
          @click="drawerOpen.right = !drawerOpen.right"
        >
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen.left"
      :content-class="darkerClass"
      show-if-above
      bordered
    >
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
      show-if-above
      bordered
    >
      <q-splitter :value="125" style="height: 100vh" unit="px" horizontal>
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
