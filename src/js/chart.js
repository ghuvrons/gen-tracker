import { min as getMin, max as getMax } from "lodash";

const findRangeX = ({ labels }, { min, max }) => ({
  xMin: labels[min],
  xMax: labels[max],
});
const findRangeY = ({ data }, { beginAtZero }, { min, max }) => {
  const scope = data.filter((_, i) => i >= min && i <= max);
  let yMin = getMin(scope);
  let yMax = getMax(scope);

  // correction
  if (beginAtZero) {
    if (yMin > 0) yMin = 0;
    else yMax = 0;
  }
  if (yMax == yMin) {
    if (yMin >= 0) yMax += 1;
    else yMin -= 1;
  }

  return { yMin, yMax };
};

const grabDatasets = (reports, field) => {
  const datasets = [];
  const labels = [];

  reports
    .filter((report) => report[field])
    .forEach((report) => {
      datasets.unshift(report[field].val);
      labels.unshift(report.logDatetime.val);
    });

  return {
    datasets,
    labels,
  };
};

export { findRangeX, findRangeY, grabDatasets };
