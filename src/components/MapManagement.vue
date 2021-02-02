<template>
  <div class="row" :style="{ height: height + 'px' }">
    <div class="col-xs-12" :class="{ 'col-sm-6': showStreetView }">
      <gmap-map class="fit" :center="center" :zoom="zoom" map-type-id="roadmap">
        <gmap-marker v-if="position.valid" :position="position"></gmap-marker>
        <gmap-polyline
          v-if="path.length > 0"
          :path="path"
          ref="polyline"
        ></gmap-polyline>
      </gmap-map>
    </div>

    <div v-if="showStreetView" class="col-xs-12 col-sm-6">
      <gmap-street-view-panorama
        class="fit"
        :position="position"
        :pov="pov"
        :zoom="1"
        @pano_changed="updatePano"
        @pov_changed="updatePov"
      ></gmap-street-view-panorama>
    </div>
  </div>
</template>

<script>
import { genPosition, getHeading } from 'components/js/map'
import { config } from 'components/js/opt/config'
import { devReports } from '../store/db/getter-types'
import { parseReportData } from 'components/js/report'
import { mapState, mapGetters } from 'vuex'

export default {
  // name: 'ComponentName',
  props: {
    height: Number,
    pageWidth: Number
  },
  data() {
    return {
      center: { ...config.map.centerIndonesia },
      position: {
        ...config.map.centerIndonesia,
        valid: false
      },
      zoom: config.map.zoom,
      pov: null,
      pano: null,
      path: []
    }
  },
  computed: {
    ...mapState('db', ['theReport']),
    ...mapGetters('db', [devReports]),
    showStreetView() {
      return this.pageWidth >= 728
    }
  },
  methods: {
    updatePov(pov) {
      this.pov = pov
    },
    updatePano(pano) {
      this.pano = pano
    },
    setPosition({ valid, ...location }) {
      if (valid) {
        this.zoom = 17
        this.center = { ...location }
      } else {
        this.zoom = config.map.zoom
        this.center = { ...config.map.centerIndonesia }
      }
      this.position = { ...location, valid }
    }
  },
  watch: {
    devReports: {
      immediate: true,
      handler(reports) {
        if (reports.length > 0) {
          let { frameID, hexData } = reports[0]
          let data = parseReportData(hexData)
          let pos = genPosition(frameID, data)
          if (pos.valid) this.path.push(pos)
        }
      }
    },
    theReport: {
      immediate: true,
      handler(report) {
        if (report) {
          let { frameID, hexData } = report
          let data = parseReportData(hexData)
          this.setPosition(genPosition(frameID, data))

          if (this.pov)
            this.updatePov({
              ...this.pov,
              heading: getHeading(frameID, data)
            })
        }
      }
    }
  }
}
</script>

<style>
</style>
