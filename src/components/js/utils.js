import _ from "lodash";
import { config } from "components/js/opt/config";
import { HexToUnsignedInt, IntToHex } from "components/js/helper";

const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");

const isString = (myVar) => {
  return typeof myVar === "string" || myVar instanceof String;
};

const flowFilter = (array, substr) => {
  return _.filter(
    array,
    _.flow(
      _.identity,
      _.values,
      _.join,
      _.toLower,
      _.partialRight(_.includes, substr)
    )
  );
};

const getField = (arr, fields, target) => {
  let result = arr.find(({ field }) => field === fields);
  if (Array.isArray(fields))
    return fields.reduce((carry, _field) => {
      result = arr.find(({ field }) => field === _field);
      return {
        ...carry,
        [_field]: target ? result[target] : result,
      };
    }, {});
  return target ? result[target] : result;
};

const getValue = (arr, fields) => {
  return getField(arr, fields, "value");
};

const getOutput = (arr, fields) => {
  return getField(arr, fields, "output");
};

const calibrateTime = (data) => {
  let timezone = _.clone(config.timezone);
  let lat = getValue(data, "gpsLatitude");
  let lng = getValue(data, "gpsLongitude");
  let sendTime = getValue(data, "sendDatetime");

  // correct timestamp if not sync with server
  if (lat && lng) timezone = tzlookup(lat, lng);

  let serverTime = moment(new Date());
  let deviceTime = moment(sendTime, "X");
  let difference = Math.abs(
    moment.duration(serverTime.diff(deviceTime)).as("seconds")
  );

  //  (at least more n minutes different)
  if (!deviceTime.isValid() || difference > config.timediff)
    return serverTime.tz(timezone).format("YYMMDDHHmmssEE");
};

const parseDatetime = (hex) => {
  let timestamp = hex.match(/.{1,2}/g);

  return timestamp.reduce((carry, ts) => {
    let dt = HexToUnsignedInt(ts);
    return carry.concat(dt.toString().padStart(2, "0"));
  }, "");
};

const buildTimestamp = (ascii) => {
  let datetime = ascii.match(/.{1,2}/g);

  return (
    datetime
      .reduce((carry, dt) => carry.concat(IntToHex(parseInt(dt), 2)), "")
      .toUpperCase() + "00"
  );
};

const unix2time = (unix) => {
  return moment.unix(unix).format("HH:mm:ss");
};

export {
  flowFilter,
  isString,
  getField,
  getValue,
  getOutput,
  calibrateTime,
  parseDatetime,
  buildTimestamp,
  unix2time,
};
