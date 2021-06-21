import { Report } from "src/data/report";
import { getValue, getField, frameId } from "src/js/utils";
import { parseFrame } from "src/js/frame";
import dayjs from "src/js/dayjs";

const parseReportData = (hex) => {
  const frameID = getValue(parseFrame(hex, Report), "frameID");

  const report = Report.filter(
    ({ required }) =>
      frameId(frameID) == "FULL" || (frameId(frameID) == "SIMPLE" && required)
  );

  return parseFrame(hex, report);
};

const parseReport = (hex) => {
  const data = parseReportData(hex);

  return data.reduce(
    (acc, { field, value, output, unit }) => ({
      ...acc,
      [field]: {
        val: value,
        out: output,
      },
    }),
    { hex }
  );
};

const readReport = (report) => {
  return Object.keys(report).reduce((acc, field) => {
    let value = report[field];

    if (field != "hex") {
      const theField = getField(Report, field);

      if (theField) {
        const { group, title, unit } = theField;
        value = {
          ...value,
          group,
          title,
          unit,
        };
      }
    }

    return {
      ...acc,
      [field]: value,
    };
  }, {});
};

const nearestFullReport = (report, reports) => {
  if (!report) return;

  let idx = reports.findIndex(({ hex }) => hex === report.hex);
  if (idx < 0) return;

  while (idx < reports.length) {
    const prev = reports[idx++];
    if (frameId(prev.frameID.val) == "FULL") return prev;
  }
};

const fromNow = (sendDatetime) => {
  if (sendDatetime) return dayjs.unix(sendDatetime).endOf("second").fromNow();
  return "Unknown ago";
};

export {
  Report,
  parseReport,
  parseReportData,
  nearestFullReport,
  readReport,
  fromNow,
};
