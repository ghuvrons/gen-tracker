import { get } from "lodash";
import config from "src/js/opt/config";
import { frameId } from "src/js/utils";

const isIndonesia = ({ lng, lat }) => {
  let { lngMin, lngMax, latMin, latMax } = config.map.borderIndonesia;
  return lng > lngMin && lng < lngMax && lat > latMin && lat < latMax;
};

const getPosition = (report) => {
  let pos = {
    ...config.map.centerIndonesia,
    valid: false,
  };

  if (frameId(report?.frameID?.val) == "FULL") {
    pos.lat = report?.gpsLatitude?.val;
    pos.lng = report?.gpsLongitude?.val;
    pos.valid = isIndonesia(pos);
  }

  return pos;
};

const getHeading = (report) => {
  return frameId(report?.frameID?.val) == "FULL" ? report?.gpsHeading?.val : 0;
};

export { getPosition, getHeading };
