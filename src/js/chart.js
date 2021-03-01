import { min as getMin, max as getMax } from "lodash";

const findRangeX = ({ labels }, { min, max }) => {
  let xMin = labels[min];
  let xMax = labels[max];

  return { xMin, xMax };
};

const findRangeY = ({ data }, { beginAtZero }, { min, max }) => {
  let scope = data.filter((_, i) => i >= min && i <= max);
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
  let datasets = [];
  let labels = [];

  reports
    .filter(report => report[field])
    .forEach(report => {
      datasets.unshift(report[field].val);
      labels.unshift(report.logDatetime.val);
    });

  return {
    datasets,
    labels
  };
};

export { findRangeX, findRangeY, grabDatasets };
