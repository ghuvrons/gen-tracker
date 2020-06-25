<script>
import { Line } from 'vue-chartjs'

export default {
  // name: 'ComponentName',
  extends: Line,
  props: {
    updateData: {
      type: Boolean,
      default: false
    },
    updateOptions: {
      type: Boolean,
      default: false
    },
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    'updateData' (val) {
      this.$data._chart.update()
    },
    'updateOptions' (val) {
      this.renderChart(this.chartData, this.options)
    }
  }
}
</script>

<style>
</style>
