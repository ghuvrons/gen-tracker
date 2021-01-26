import { Report } from "components/js/report";
import moment from "moment";

const makeExportData = (devReports) => {
  return devReports.map(({ data }) => {
    let empty = Report.reduce((carry, { no }) => ({ ...carry, [no]: "" }), {});
    let filled = data
      .filter(({ chartable }) => chartable)
      .reduce(
        (carry, { output, no }) => ({
          ...carry,
          [no]: output,
        }),
        {}
      );

    return {
      ...empty,
      ...filled,
    };
  });
};

const makeExportLabel = () => {
  return Report.reduce(
    (carry, { no, title, unit }) => ({
      ...carry,
      [no]: title + (unit ? ` (${unit})` : ""),
    }),
    {}
  );
};

const makeExportName = () => {
  let now = moment().format("YYYYMMDDHHmmss");
  return `tracking-${now}.csv`;
};

const makeExport = (devReports) => {
  return {
    data: makeExportData(devReports),
    label: makeExportLabel(),
    name: makeExportName(),
  };
};

export { makeExport };
