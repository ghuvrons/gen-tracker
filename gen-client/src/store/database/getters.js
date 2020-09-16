const Long = require("long");
import { groupBy, mapValues, omit } from "lodash";
import { Events } from "../../components/js/events";

const nest = (seq, keys) => {
  if (!keys.length) {
    return seq;
  }
  let [first, ...rest] = keys;

  return mapValues(groupBy(seq, first), value => nest(value, rest));
};

export const getClientByUnitId = state => unitID => {
  let unit = state.units.find(el => el.unitID === unitID);

  return unit ? unit.client : null;
};

export const getTotalReports = state => unitID => {
  return state.reports.filter(el => el.unitID === unitID).length;
};

export const uniqueReport = state => (unitID, sequentialID) => {
  return !state.reports.find(el => {
    let seqID = el.data.find(el => el.field === "sequentialID").value;

    return el.unitID === unitID && seqID === sequentialID;
  });
};

export const selectedReports = state => {
  let reports = state.reports.filter(el => el.unitID === state.theUnit.unitID);

  return state.theUnit ? reports : [];
};

export const selectedReportEvents = (state, getters) => {
  let evt = [];

  getters.selectedReports.forEach(({ data }) => {
    let seqID = data.find(({ field }) => field === "sequentialID").value;
    let evtValue = data.find(({ field }) => field === "eventsGroup").value;
    let events = Events.filter(({ bit }) => {
      return Long.fromNumber(evtValue, 1).shiftRight(bit) & 1;
    });

    evt.push(...events.map(({ name }) => ({ name, seqID })));
  });

  return groupBy(evt, "name");
};

export const selectedResponses = state => {
  return state.theUnit
    ? state.responses.filter(el => el.unitID === state.theUnit.unitID)
    : [];
};

export const selectedFingers = state => {
  return state.theUnit
    ? state.fingers.filter(el => el.unitID === state.theUnit.unitID)
    : [];
};
