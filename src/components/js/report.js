import { config } from "components/js/opt/config";
import { Report } from "components/js/opt/report";
import { getValue } from "components/js/utils";
import { Header, parseFrame } from "components/js/frame";
import { omit, orderBy } from "lodash";

const parseReportData = (hex) => {
  let { frame } = config;
  let frameID = getValue(parseFrame(hex, Header), "frameID");

  let report = Report.filter(
    ({ required }) =>
      frameID == frame.id.FULL || (frameID == frame.id.SIMPLE && required)
  );

  return parseFrame(hex, report);
};

const parseReport = (hex) => {
  let data = parseReportData(hex);

  return data.reduce(
    (carry, { field, value, output }) => ({
      ...carry,
      [field]: {
        val: value,
        out: output,
      },
    }),
    { hex }
  );
};

const lastFullReport = (report, reports) => {
  let index = reports.findIndex(({ hex }) => hex === report.hex);

  if (index >= 0) {
    while (index < reports.length) {
      let prev = reports[index++];
      if (prev.frameID.val === config.frame.id.FULL) return prev;
    }
  }
  return;
};

export { Report, parseReport, parseReportData, lastFullReport };
