import _ from "lodash";
import { config } from "components/js/opt/config";
import { Report } from "components/js/report";

const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");

const getField = (arr, fields) => {
  if (Array.isArray(fields))
    return fields.reduce(
      (carry, _field) => ({
        ...carry,
        [_field]: arr.find(({ field }) => field === _field).value,
      }),
      {}
    );
  return arr.find(({ field }) => field === fields).value;
};

const calibrateTime = (data) => {
  let timezone = _.clone(config.timezone);
  let lat = getField(data, "gpsLatitude");
  let lng = getField(data, "gpsLongitude");
  let sendTime = getField(data, "rtcSendDatetime");

  // correct timestamp if not sync with server
  if (lat && lng) timezone = tzlookup(lat, lng);

  let serverTime = moment(new Date());
  let deviceTime = moment(sendTime, "X");
  let difference = Math.abs(
    moment.duration(serverTime.diff(deviceTime)).as("seconds")
  );

  //  (at least more n minutes different)
  if (!deviceTime.isValid() || difference > config.timediff)
    return serverTime.tz(timezone).format("YYMMDDHHmmssE");
};

const genFingerID = (devFingers) => {
  let id = 0;
  let usedFingerIDs = devFingers.map(({ fingerID }) => parseInt(fingerID));

  // sort id to ascending
  usedFingerIDs.sort((a, b) => a - b);

  // check the lowest unused id
  for (let i = 0; i < config.finger.max; i++)
    if (usedFingerIDs[i] !== id++) break;

  if (id >= this.$config.finger.max) id = -1;

  return id;
};

const makeExportData = (devReports) => {
  return (
    devReports
      // .reverse()
      .map(({ data }) =>
        data
          .reverse()
          .filter(({ chartable }) => chartable)
          .reduce(
            (carry, { field, value, output, unit }) => ({
              ...carry,
              [field]: output,
            }),
            {}
          )
      )
  );
};

const makeExportLabel = () => {
  return Report.reduce(
    (carry, { field, title, unit }) => ({
      ...carry,
      [field]: title + (unit ? ` (${unit})` : ""),
    }),
    {}
  );
};

const makeExportFilename = () => {
  let now = moment().format("YYYYMMDDHHmmss");
  return `tracking-${now}.csv`;
};

const isStr = (myVar) => {
  return typeof myVar === "string" || myVar instanceof String;
};

export {
  getField,
  calibrateTime,
  genFingerID,
  makeExportData,
  makeExportLabel,
  makeExportFilename,
  isStr,
};
