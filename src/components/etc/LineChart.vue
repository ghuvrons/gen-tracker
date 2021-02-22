<script>
import { Line } from "vue-chartjs";

export default {
  // name: 'ComponentName',
  extends: Line,
  props: {
    param: {
      type: Object,
      required: true
    },
    update: {
      type: Object,
      required: true
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      this.renderChart(this.param.data, this.param.options);
    }
  },
  watch: {
    "update.data": function(val) {
      this.$data._chart.update();
    },
    "update.options": function(val) {
      this.render();
    }
  }
};
</script>

<style>
</style>
