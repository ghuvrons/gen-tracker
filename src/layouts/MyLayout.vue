<template>
  <q-layout view="lHr LpR lFr">
    <!--can be placed anywhere within your template -->
    <q-window-resize-observable @resize="onResize" />

    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="drawerOpen.left = !drawerOpen.left"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ config.app.title }}
          <div slot="subtitle">Rev.{{ config.app.version}} &copy; {{ config.app.subTitle }} </div>
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          v-if="$q.fullscreen.isCapable"
          @click="$q.fullscreen.toggle()"
        >
          <q-icon :name="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" />
        </q-btn>

        <q-btn
          flat
          dense
          round
          @click="drawerOpen.right = !drawerOpen.right"
        >
          <q-icon name="apps" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="drawerOpen.left"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <unit-management :height="height.top"></unit-management>
      <report-management :height="height.bottom - 70"></report-management>
    </q-layout-drawer>

    <q-layout-drawer
      side="right"
      v-model="drawerOpen.right"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <command-management></command-management>
      <response-log :height="height.bottom - 90"></response-log>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import ReportManagement from 'components/ReportManagement'
import UnitManagement from 'components/UnitManagement'
import ResponseLog from 'components/ResponseLog'
import CommandManagement from 'components/CommandManagement'
import { mapState } from 'vuex'

export default {
  name: 'MyLayout',
  components: {
    ReportManagement,
    UnitManagement,
    ResponseLog,
    CommandManagement
  },
  data () {
    return {
      drawerOpen: {
        left: this.$q.platform.is.desktop,
        right: false
      },
      height: {
        top: 90,
        bottom: 0
      }
    }
  },
  computed: {
    ...mapState('database', ['config'])
  },
  methods: {
    onResize ({ height }) {
      this.height.bottom = height - this.height.top
    }
  }
}
</script>

<style></style>
