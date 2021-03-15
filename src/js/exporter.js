import { Report } from "src/js/report";
import { ExportToCsv } from "export-to-csv";
import exportFromJSON from "export-from-json";
import dayjs from "src/js/dayjs";

const makeDataCSV = (reports) => {
  return reports.map((report) => ({
    ...Report.reduce(
      (acc, { field, no }) => ({
        ...acc,
        [no]: report[field] ? report[field].out : "",
      }),
      {}
    ),
  }));
};

const makeLabelCSV = () => {
  return Report.reduce(
    (acc, { title, unit }) => acc.concat([title + (unit ? ` (${unit})` : "")]),
    []
  );
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
    headers: makeLabelCSV(),
  });

  csvExporter.generateCsv(makeDataCSV(reports));
};

const makeDataJSON = (reports) => {
  return reports ? reports.map(({ hex }) => hex) : [];
};

const exportJSON = (reports) => {
  const fileName = `tracking-${dayjs().format("YYMMDDHHmmss")}`;
  const data = makeDataJSON(reports.slice().reverse());
  const exportType = "json";

  exportFromJSON({ data, fileName, exportType });
};

const importJSON = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) reject();

    const reader = new FileReader();
    reader.onload = (e) => resolve(JSON.parse(e.target.result));
    reader.readAsText(file);
  });
};

export { exportCSV, exportJSON, importJSON };
