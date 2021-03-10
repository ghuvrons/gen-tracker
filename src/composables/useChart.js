import chart from "src/js/opt/chart";
import { findRangeX, findRangeY, grabDatasets } from "src/js/chart";

import { cloneDeep } from "lodash";
import { toRefs, reactive, computed } from "vue";

export default function () {
  const state = reactive({
    chart: cloneDeep(chart),
    history: {
      update: {
        data: false,
        options: false,
      },
    },
  });

  const latestValue = computed(
    () => state.chart.data.datasets[0].data.slice(-1)[0]
  );

  const setScales = ({ xMin, xMax, yMin, yMax }, { beginAtZero }) => {
    state.chart.options.scales.xAxes[0].ticks.min = xMin;
    state.chart.options.scales.xAxes[0].ticks.max = xMax;
    state.chart.options.scales.yAxes[0].ticks.min = yMin;
    state.chart.options.scales.yAxes[0].ticks.max = yMax;
    state.chart.options.scales.yAxes[0].ticks.beginAtZero = beginAtZero;

    state.history.update.options = !state.history.update.options;
  };
  const setData = ({ labels, datasets }) => {
    state.chart.data.labels = labels;
    state.chart.data.datasets[0].data = datasets;

    state.history.update.data = !state.history.update.data;
  };
  const setLabel = ({ title, unit }) => {
    state.chart.data.datasets[0].label = title;
    state.chart.options.scales.yAxes[0].scaleLabel.labelString =
      unit || "Value";

    state.history.update.options = !state.history.update.options;
  };
  const setColor = (color) => {
    state.chart.options.legend.labels.fontColor = color;
    state.chart.options.scales.xAxes[0].ticks.fontColor = color;
    state.chart.options.scales.xAxes[0].scaleLabel.fontColor = color;
    state.chart.options.scales.xAxes[0].gridLines.color = color;
    state.chart.options.scales.yAxes[0].ticks.fontColor = color;
    state.chart.options.scales.yAxes[0].scaleLabel.fontColor = color;
    state.chart.options.scales.yAxes[0].gridLines.color = color;

    state.history.update.options = !state.history.update.options;
  };

  const scaleChart = ({ beginAtZero }, { min, max }) => {
    let { xMin, xMax } = findRangeX(state.chart.data, { min, max });
    let { yMin, yMax } = findRangeY(
      state.chart.data.datasets[0],
      { beginAtZero },
      { min, max }
    );

    setScales({ xMin, xMax, yMin, yMax }, { beginAtZero });
  };
  const writeChart = (reports, field) => {
    const { datasets, labels } = grabDatasets(reports, field);

    setData({ datasets, labels });

    return {
      min: 0,
      max: labels.length - 1,
    };
  };

  return {
    ...toRefs(state),
    latestValue,

    setLabel,
    setColor,

    scaleChart,
    writeChart,
  };
}
