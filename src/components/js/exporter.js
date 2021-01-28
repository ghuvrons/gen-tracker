import { Report } from "components/js/report";
import moment from "moment";
import exportFromJSON from "export-from-json";

const makeExportData = (reports) => {
  return reports.map(({ data }) => {
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
  return `tracking-${now}`;
};

const makeExportCSV = (reports) => {
  return {
    data: makeExportData(reports),
    label: makeExportLabel(),
    name: `${makeExportName()}.csv`,
  };
};

const makeExportJSON = (reports) => {
  const data = reports.map(({ hexData }) => hexData);
  const fileName = makeExportName();
  const exportType = "json";

  exportFromJSON({ data, fileName, exportType });
};

export { makeExportCSV, makeExportJSON };
