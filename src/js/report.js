import { Report } from "src/js/opt/report";
import { getValue, getField, frameId } from "src/js/utils";
import { parseFrame } from "src/js/frame";
import moment from "moment";

const parseReportData = hex => {
  let frameID = getValue(parseFrame(hex, Report), "frameID");

  let report = Report.filter(
    ({ required }) =>
      frameID == frameId("FULL") || (frameID == frameId("SIMPLE") && required)
  );

  return parseFrame(hex, report);
};

const parseReport = hex => {
  let data = parseReportData(hex);

  return data.reduce(
    (acc, { field, value, output, unit }) => ({
      ...acc,
      [field]: {
        val: value,
        out: output
      }
    }),
    { hex }
  );
};

const readReport = report => {
  return Object.keys(report).reduce((acc, field) => {
    let value = report[field];

    if (field != "hex") {
      let { group, title, unit } = getField(Report, field);
      value = {
        ...value,
        group,
        title,
        unit
      };
    }

    return {
      ...acc,
      [field]: value
    };
  }, {});
};

const lastFullReport = (report, reports) => {
  if (!report) return;

  let index = reports.findIndex(({ hex }) => hex === report.hex);
  if (index < 0) return;

  while (index < reports.length) {
    let prev = reports[index++];
    if (prev.frameID.val === frameId("FULL")) return prev;
  }
};

const lastSendDatetime = report => {
  if (report)
    return moment
      .unix(report.sendDatetime.val)
      .endOf("second")
      .fromNow();
  return "Unknown ago";
};

export {
  Report,
  parseReport,
  parseReportData,
  lastFullReport,
  readReport,
  lastSendDatetime
};
