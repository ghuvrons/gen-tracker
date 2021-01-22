import { config } from "components/js/config";
import _ from "lodash";
const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");

const calibrateDeviceTime = (data) => {
  let timezone = _.clone(config.timezone);
  let lat = data.find(({ field }) => field === "gpsLatitude").value;
  let lng = data.find(({ field }) => field === "gpsLongitude").value;
  let sendTime = data.find(({ field }) => field === "rtcSendDatetime").value;

  // correct timestamp if not sync with server
  if (lat !== 0 && lng !== 0) timezone = tzlookup(lat, lng);

  let serverTime = moment(new Date());
  let deviceTime = moment(sendTime, "X");
  let difference = Math.abs(
    moment.duration(serverTime.diff(deviceTime)).as("seconds")
  );

  //  (at least more n minutes different)
  if (!deviceTime.isValid() || difference > config.timediff)
    return serverTime.tz(timezone).format("YYMMDDHHmmssE");
};

const makeFingerID = (devFingers) => {
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

export { calibrateDeviceTime, makeFingerID };
