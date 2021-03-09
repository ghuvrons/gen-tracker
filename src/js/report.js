import { Report } from "src/js/opt/report";
import { getValue, getField, frameId } from "src/js/utils";
import { parseFrame } from "src/js/frame";
import dayjs from "src/js/dayjs";

const parseReportData = hex => {
  let frameID = getValue(parseFrame(hex, Report), "frameID");

  let report = Report.filter(
    ({ required }) =>
      frameId(frameID) == "FULL" || (frameId(frameID) == "SIMPLE" && required)
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

const nearestFullReport = (report, reports) => {
  if (!report) return;

  let index = reports.findIndex(({ hex }) => hex === report.hex);
  if (index < 0) return;

  while (index < reports.length) {
    let prev = reports[index++];
    if (frameId(prev.frameID.val) == "FULL") return prev;
  }
};

const fromNow = sendDatetime => {
  if (sendDatetime)
    return dayjs
      .unix(sendDatetime)
      .endOf("second")
      .fromNow();
  return "Unknown ago";
};

export {
  Report,
  parseReport,
  parseReportData,
  nearestFullReport,
  readReport,
  fromNow
};
