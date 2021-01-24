import { config } from "components/js/opt/config";
import { Report } from "components/js/opt/report";
import { Header, parseFrame } from "components/js/frame";

const parseReport = (hexData) => {
  let header = parseFrame(hexData, Header);
  let { frameID, unitID } = Field(header, ["frameID", "unitID"]);

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

export { Report, parseReport, requiredReport, optionalReport };
