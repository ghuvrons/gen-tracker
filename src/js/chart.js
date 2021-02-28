import { min, max, findLastIndex } from "lodash";

const findRange = ({ labels }, { min, max }) => {
  let iMin = min ? labels.findIndex((val, idx) => idx >= min) : 0;
  let iMax = max
    ? findLastIndex(labels, (val, idx) => idx <= max)
    : labels.length - 1;

  return { iMin, iMax };
};

const findRangeX = ({ labels }, { iMin, iMax }) => {
  let xMin = labels[iMin];
  let xMax = labels[iMax];

  return { xMin, xMax };
};

const findRangeY = ({ data }, { beginAtZero }, { iMin, iMax }) => {
  let scope = data.filter((_, i) => i >= iMin && i <= iMax);
  let yMin = min(scope);
  let yMax = max(scope);

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

const getLabel = ({ labels }, index) => {
  if (index >= 0) return labels[index];
  return labels[labels.length - 1];
};

const grabDatasets = (reports, field) => {
  let datasets = [];
  let labels = [];

  reports.forEach(report => {
    if (report[field]) {
      datasets.push(report[field].val);
      labels.push(report.logDatetime.val);
    }
  });

  return {
    datasets: datasets.reverse(),
    labels: labels.reverse()
  };
};

export { findRange, findRangeX, findRangeY, getLabel, grabDatasets };
