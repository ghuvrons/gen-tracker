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
          @click="drawer.left = !drawer.left"
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
          @click="drawer.right = !drawer.right"
        >
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer.left"
      :content-class="darkerClass"
      show-if-above
      bordered
    >
      <q-splitter v-model="splitter" style="height: 100vh" unit="px" horizontal>
        <template v-slot:before>
          <unit-management :height="splitter"></unit-management>
        </template>
        <template v-slot:separator>
          <q-avatar
            color="secondary"
            class="text-right"
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

    <q-drawer
      side="right"
      v-model="drawer.right"
      :content-class="darkerClass"
      show-if-above
      bordered
    >
      <command-management style="height: 120px"></command-management>
      <response-log :height="120"></response-log>
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
      drawer: {
        left: this.$q.platform.is.desktop,
        right: false,
      },
      splitter: 150,
    };
  },
};
</script>

<style></style>
