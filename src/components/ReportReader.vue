<template>
  <div class="shadow-1">
    <p class="q-pa-sm q-mb-none">
      Report Reader
      <q-chip color="negative" dense square v-if="theReport">
        {{ theReport.frameID === $config.frame.id.FULL ? "FULL" : "SIMPLE" }}
      </q-chip>
    </p>

    <q-scroll-area
      class="bg-white"
      :style="{ height: (height < 150 ? 150 : height) + 'px' }"
    >
      <q-list separator dense v-if="theReport">
        <!-- the new required frame -->
        <q-item
          v-for="data in requiredReport"
          :link="devReports.length > 1 && data.chartable"
          :key="data.field"
          :class="{ 'bg-dark text-white': activeField(data) }"
          @click.native="collectionData = data"
        >
          <q-item-main>
            <q-item-tile label>{{ data.title }}</q-item-tile>
            <q-item-tile sublabel
              >{{ data.output }} {{ data.unit }}</q-item-tile
            >
          </q-item-main>
          <q-item-side right color="green" icon="cloud_download" />
        </q-item>

        <!-- add latest optional frame -->
        <q-item
          v-for="data in optionalReport"
          :link="devReports.length > 1 && data.chartable"
          :key="data.field"
          :class="{ 'bg-dark text-white': activeField(data) }"
          @click.native="collectionData = data"
        >
          <q-item-main>
            <q-item-tile label>{{ data.title }}</q-item-tile>
            <q-item-tile sublabel
              >{{ data.output }} {{ data.unit }}</q-item-tile
            >
          </q-item-main>
          <q-item-side
            right
            :color="
              theReport.frameID === $config.frame.id.FULL ? 'green' : 'red'
            "
            :icon="
              theReport.frameID === $config.frame.id.FULL
                ? 'cloud_download'
                : 'cloud_off'
            "
          />
        </q-item>
      </q-list>

      <q-alert v-else icon="info" color="faded" class="q-ma-xs">
        No active report yet
      </q-alert>
    </q-scroll-area>

    <report-collection-modal
      :height="height - 210"
      :data="collectionData"
      @close="collectionData = null"
    >
    </report-collection-modal>
  </div>
</template>

<script>
import ReportCollectionModal from 'components/etc/ReportCollectionModal'
import { devReports } from '../store/db/getter-types'
import { mapState, mapGetters } from 'vuex'

export default {
  // name: 'ComponentName',
  components: {
    ReportCollectionModal
  },
  props: {
    height: Number
  },
  data() {
    return {
      collectionData: null
    }
  },
  computed: {
    ...mapState('db', ['theReport']),
    ...mapGetters('db', [devReports]),
    requiredReport() {
      return this.theReport.data.filter(({ required }) => required)
    },
    optionalReport() {
      let index = this.devReports.findIndex(
        ({ hexData }) => hexData === this.theReport.hexData
      )

      while (index < this.devReports.length) {
        let previous = this.devReports[index++]
        if (previous.frameID === this.$config.frame.id.FULL)
          return previous.data.filter(({ required }) => !required)
      }

      return []
    }
  },
  methods: {
    activeField({ field }) {
      if (this.collectionData) return this.collectionData.field == field
      return false
    }
  }
}
</script>

<style></style>
