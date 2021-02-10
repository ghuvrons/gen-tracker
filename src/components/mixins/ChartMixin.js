import { cloneDeep } from "lodash";
import chart from "components/js/opt/chart";

export default {
  data() {
    return {
      chart: cloneDeep(chart),
      history: {
        update: {
          data: false,
          options: false,
        },
      },
    };
  },
  methods: {
    setChartScales({ xMin, xMax, yMin, yMax }, { beginAtZero }) {
      this.chart.options.scales.xAxes[0].ticks.max = xMax;
      this.chart.options.scales.xAxes[0].ticks.min = xMin;
      this.chart.options.scales.yAxes[0].ticks.max = yMax;
      this.chart.options.scales.yAxes[0].ticks.min = yMin;
      this.chart.options.scales.yAxes[0].ticks.beginAtZero = beginAtZero;

      this.history.update.options = !this.history.update.options;
    },
    setChartData({ labels, datasets }) {
      this.chart.data.labels.push(...labels);
      this.chart.data.datasets[0].data.push(...datasets);

      this.history.update.data = !this.history.update.data;
    },
    setChartLabel({ title, unit }) {
      this.chart.data.datasets[0].label = title;
      this.chart.options.scales.yAxes[0].scaleLabel.labelString =
        unit || "Value";

      this.history.update.options = !this.history.update.options;
    },
    setChartColor(color) {
      this.chart.options.legend.labels.fontColor = color;
      this.chart.options.scales.xAxes[0].ticks.fontColor = color;
      this.chart.options.scales.xAxes[0].scaleLabel.fontColor = color;
      this.chart.options.scales.xAxes[0].gridLines.color = color;
      this.chart.options.scales.yAxes[0].ticks.fontColor = color;
      this.chart.options.scales.yAxes[0].scaleLabel.fontColor = color;
      this.chart.options.scales.yAxes[0].gridLines.color = color;

      this.history.update.options = !this.history.update.options;
    },
  },
};
