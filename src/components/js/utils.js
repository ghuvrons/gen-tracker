import _ from "lodash";
import config from "components/js/opt/config";
import { HexToUnsignedInt, IntToHex } from "components/js/helper";
import moment from "moment";
import "moment-timezone";

// const moment = require("moment-timezone");
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

const dilation = (unix, as, start) => {
  if (!start) start = moment();
  let diff = start.diff(moment.unix(unix));
  return Math.abs(moment.duration(diff).as(as));
};

const calibrateTime = ({ gpsLatitude, gpsLongitude, sendDatetime }) => {
  let timezone = _.clone(config.timezone);

  // correct timestamp if not sync with server
  if (gpsLatitude.val && gpsLongitude.val)
    timezone = tzlookup(gpsLatitude.val, gpsLongitude.val);

  let serverTime = moment();
  let deviceTime = moment.unix(sendDatetime.val);
  let diff = dilation(deviceTime, "seconds", serverTime);

  //  (at least more n minutes different)
  if (!deviceTime.isValid() || diff > config.timeDilation)
    return serverTime.tz(timezone).format("YYMMDDHHmmss0E");
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

const toArrayTree = (obj, data) => {
  return Object.keys(obj).map((key) => {
    return typeof obj[key] === "object"
      ? { label: key, children: toArrayTree(obj[key], data) }
      : {
          label: key,
          data: data && data[key] && data[key].out,
        };
  });
};

const removeWords = (str, arr) => {
  return arr.reduce((acc, val) => {
    const regex = new RegExp(`${val}`, "gi");
    return acc.replace(regex, "");
  }, str);
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
  toArrayTree,
  removeWords,
  dilation,
};
