import config from "src/data/config";
import { HexToUnsignedInt, IntToHex } from "src/js/formatter";

import {
  filter,
  flow,
  identity,
  values,
  join,
  toLower,
  partialRight,
  includes,
  clone,
} from "lodash";
const tzlookup = require("tz-lookup");
import dayjs from "src/js/dayjs";

const flowFilter = (arr, substr) => {
  return filter(
    arr,
    flow(identity, values, join, toLower, partialRight(includes, substr))
  );
};

const getField = (arr, fields, target) => {
  let result = arr.find(({ field }) => field === fields);
  if (Array.isArray(fields))
    return fields.reduce((acc, _field) => {
      result = arr.find(({ field }) => field === _field);
      return {
        ...acc,
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

const dilation = (unix, as, startUnix) => {
  let start = dayjs();
  if (startUnix) start = dayjs.unix(startUnix);

  const diff = start.diff(dayjs.unix(unix));
  return dayjs.duration(diff).as(as);
};

const calibrateTime = ({ gpsLatitude, gpsLongitude, sendDatetime }) => {
  let { timezone } = config;

  // correct timestamp if not sync with server
  if (gpsLatitude.val && gpsLongitude.val)
    timezone = tzlookup(gpsLatitude.val, gpsLongitude.val);

  const serverTime = dayjs();
  // const deviceTime = dayjs.unix(sendDatetime.val);
  // const diff = dilation(deviceTime, "seconds", serverTime.unix());

  //  (at least more n minutes different)
  // if (!deviceTime.isValid() || Math.abs(diff) > 120)

  return serverTime.tz(timezone).format("YYMMDDHHmmss0d");
};

const parseDatetime = (hex) => {
  const timestamp = hex.match(/.{1,2}/g);

  return timestamp.reduce(
    (acc, ts) => acc.concat(HexToUnsignedInt(ts).toString().padStart(2, "0")),
    ""
  );
};

const buildTimestamp = (YYMMDDHHmmss0d) => {
  const datetime = YYMMDDHHmmss0d.match(/.{1,2}/g);

  return datetime
    .reduce((acc, dt) => acc.concat(IntToHex(parseInt(dt), 2)), "")
    .toUpperCase();
};

const frameId = (index) => {
  return config.frames[index];
};

const mod = (str) => {
  return str.split("/")[1];
};

const log = (type, msg) => {
  return console[type](msg);
};

export {
  flowFilter,
  getField,
  getValue,
  getOutput,
  calibrateTime,
  parseDatetime,
  buildTimestamp,
  dilation,
  frameId,
  mod,
  log,
};
