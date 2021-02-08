import config from "components/js/opt/config";
import { Report } from "components/js/opt/report";
import { getValue } from "components/js/utils";
import { Header, parseFrame } from "components/js/frame";
import { groupBy, set } from "lodash";

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
    (carry, { field, value, output, unit }) => ({
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
  if (!report) return;

  let index = reports.findIndex(({ hex }) => hex === report.hex);
  if (index < 0) return;

  while (index < reports.length) {
    let prev = reports[index++];
    if (prev.frameID.val === config.frame.id.FULL) return prev;
  }
};

const groupReport = () => {
  let group = groupBy(Report, "group");
  return Object.keys(group).reduce((o, key) => {
    return set(
      o,
      key,
      group[key].reduce((c, el) => {
        return { ...c, [el.field]: "" };
      }, {})
    );
  }, {});
};

export { Report, parseReport, parseReportData, lastFullReport, groupReport };
