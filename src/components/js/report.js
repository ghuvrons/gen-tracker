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

const requiredReport = (theReport) => {
  return theReport.data.filter(({ required }) => required);
};

const optionalReport = (theReport, devReports) => {
  let index = devReports.findIndex(
    ({ hexData }) => hexData === theReport.hexData
  );

  while (index < devReports.length) {
    let previous = devReports[index++];
    if (previous.frameID === config.frame.id.FULL)
      return previous.data.filter(({ required }) => !required);
  }
  return [];
};

const reportData = (theReport, devReports) => {
  return orderBy(
    [...requiredReport(theReport), ...optionalReport(theReport, devReports)],
    "no"
  );
};

export { Report, parseReport, reportData };
