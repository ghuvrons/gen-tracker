const Long = require("long");
import { groupBy, mapValues, omit } from "lodash";
import { Events } from "../../components/js/events";

export const getTotalReports = ({ reports }) => unitID => {
  return reports.filter(({ unitID: _unitID }) => _unitID === unitID).length;
};

export const uniqueReport = ({ reports }) => (unitID, sequentialID) => {
  return !reports.find(({ data, unitID: _unitID }) => {
    let seqID = data.find(({ field }) => field === "sequentialID").value;

    return _unitID === unitID && seqID === sequentialID;
  });
};

export const selectedReports = ({ reports, theUnit }) => {
  let _reports = reports.filter(({ unitID }) => unitID === theUnit.unitID);

  return theUnit ? _reports : [];
};

export const selectedReportEvents = (state, getters) => {
  let events = getters.selectedReports.reduce((carry, { data }) => {
    let seqID = data.find(({ field }) => field === "sequentialID").value;
    let evtValue = data.find(({ field }) => field === "eventsGroup").value;
    let events = Events.filter(({ bit }) => {
      return Long.fromNumber(evtValue, 1).shiftRight(bit) & 1;
    });

    return [...carry, ...events.map(({ name }) => ({ name, seqID }))];
  }, []);

  return groupBy(events, "name");
};

export const selectedResponses = ({ responses, theUnit }) => {
  return theUnit
    ? responses.filter(({ unitID }) => unitID === theUnit.unitID)
    : [];
};

export const selectedFingers = ({ fingers, theUnit }) => {
  return theUnit
    ? fingers.filter(({ unitID }) => unitID === theUnit.unitID)
    : [];
};
