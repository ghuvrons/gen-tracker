import { config } from "components/js/opt/config";
import { Report } from "components/js/opt/report";
import { getValue } from "components/js/utils";
import { Header, parseFrame } from "components/js/frame";
import { orderBy } from "lodash";

const parseReportData = (hexData) => {
  let { frame } = config;
  let header = parseFrame(hexData, Header);
  let { frameID } = getValue(header, ["unitID", "frameID"]);

  let report = Report.filter(
    ({ required }) =>
      frameID == frame.id.FULL || (frameID == frame.id.SIMPLE && required)
  );

  return parseFrame(hexData, report);
};

const parseReport = (hexData) => {
  let data = parseReportData(hexData);

  let { unitID, frameID, logDatetime } = getValue(data, [
    "unitID",
    "frameID",
    "logDatetime",
  ]);

  return {
    unitID,
    frameID,
    logDatetime,
    hexData,
  };
};

const requiredReport = ({ hexData }) => {
  let data = parseReportData(hexData);
  return data.filter(({ required }) => required);
};

const optionalReport = (report, reports) => {
  let index = reports.findIndex(({ hexData }) => hexData === report.hexData);

  while (index < reports.length) {
    let prev = reports[index++];
    if (prev.frameID === config.frame.id.FULL) {
      let data = parseReportData(prev.hexData);
      return data.filter(({ required }) => !required);
    }
  }
  return [];
};

const reportData = (report, reports) => {
  return orderBy(
    [...requiredReport(report), ...optionalReport(report, reports)],
    "no"
  );
};

export { Report, parseReport, parseReportData, reportData };
