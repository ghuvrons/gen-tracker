import { config } from "components/js/opt/config";
import { Report } from "components/js/opt/report";
import { getField } from "components/js/utils";
import { Header, parseFrame } from "components/js/frame";
import { orderBy } from "lodash";

const parseReport = (hexData) => {
  let header = parseFrame(hexData, Header);
  let { frameID, unitID } = getField(header, ["frameID", "unitID"]);

  let report = Report.filter((el) => {
    let { frame } = config;
    return (
      frameID == frame.id.FULL || (frameID == frame.id.SIMPLE && el.required)
    );
  });

  return {
    unitID,
    frameID,
    hexData,
    data: parseFrame(hexData, report),
  };
};

const requiredReport = ({ data }) => {
  return data.filter(({ required }) => required);
};

const optionalReport = (report, reports) => {
  let index = reports.findIndex(({ hexData }) => hexData === report.hexData);

  while (index < reports.length) {
    let previous = reports[index++];
    if (previous.frameID === config.frame.id.FULL)
      return previous.data.filter(({ required }) => !required);
  }
  return [];
};

const reportData = (report, reports) => {
  return orderBy(
    [...requiredReport(report), ...optionalReport(report, reports)],
    "no"
  );
};

export { Report, parseReport, reportData };
