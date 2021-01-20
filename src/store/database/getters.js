const Long = require("long");
import { groupBy, mapValues, omit } from "lodash";
import { Events } from "../../components/js/events";

export const getTotalReports = ({ reports }) => (unitID) => {
  return reports.filter(({ unitID: _unitID }) => _unitID === unitID).length;
};

export const uniqueReport = ({ reports }) => (unitID, sequentialID) => {
  return !reports.find(({ data, unitID: _unitID }) => {
    let seqID = data.find(({ field }) => field === "sequentialID").value;

    return _unitID === unitID && seqID === sequentialID;
  });
};

export const devReports = ({ reports, theUnit }) => {
  let _reports = reports.filter(({ unitID }) => unitID === theUnit);

  return theUnit ? _reports : [];
};

export const devEvents = (state, getters) => {
  let events = getters.devReports.reduce((carry, { data }) => {
    let seqID = data.find(({ field }) => field === "sequentialID").value;
    let evtValue = data.find(({ field }) => field === "eventsGroup").value;
    let events = Events.filter(
      ({ bit }) => Long.fromNumber(evtValue, 1).shiftRight(bit) & 1
    );

    return [...carry, ...events.map(({ name }) => ({ name, seqID }))];
  }, []);

  return groupBy(events, "name");
};

export const devCommands = ({ commands, theUnit }) => {
  return theUnit ? commands.filter(({ unitID }) => unitID === theUnit) : [];
};

export const devFingers = ({ fingers, theUnit }) => {
  return theUnit ? fingers.filter(({ unitID }) => unitID === theUnit) : [];
};
