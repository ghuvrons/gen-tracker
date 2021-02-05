import { Report } from "components/js/report";
import { ExportToCsv } from "export-to-csv";
import exportFromJSON from "export-from-json";
import moment from "moment";

const makeExportData = (reports) => {
  return reports.map((report) => ({
    ...Report.reduce(
      (carry, { field, no }) => ({
        ...carry,
        [no]: report[field] ? report[field].out : "",
      }),
      {}
    ),
  }));
};

const makeExportLabel = () => {
  return Report.reduce(
    (carry, { title, unit }) =>
      carry.concat([title + (unit ? ` (${unit})` : "")]),
    []
  );
};

const makeExportName = () => {
  let now = moment().format("YYYYMMDDHHmmss");
  return `tracking-${now}`;
};

const exportCSV = (reports) => {
  const csvExporter = new ExportToCsv({
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: false,
    title: "My Awesome CSV",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: makeExportLabel(),
  });

  csvExporter.generateCsv(makeExportData(reports));
};

const exportJSON = (reports) => {
  const data = reports.map(({ hex }) => hex);
  const fileName = makeExportName();
  const exportType = "json";

  exportFromJSON({ data, fileName, exportType });
};

export { exportCSV, exportJSON };
