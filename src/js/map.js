import config from "src/js/opt/config";
import { frameId } from "src/js/utils";

// const isIndonesia = ({ lng, lat }) => {
//   const { lngMin, lngMax, latMin, latMax } = config.map.borderIndonesia;
//   return lng > lngMin && lng < lngMax && lat > latMin && lat < latMax;
// };

const getPosition = (report) => {
  const pos = {
    ...config.map.centerIndonesia,
    valid: false,
  };

  if (frameId(report?.frameID?.val) == "FULL") {
    pos.lat = report?.gpsLatitude?.val;
    pos.lng = report?.gpsLongitude?.val;
    pos.valid = report?.gpsHDOP?.val < 2;
  }

  return pos;
};

const getHeading = (report) => {
  return frameId(report?.frameID?.val) == "FULL" ? report?.gpsHeading?.val : 0;
};

export { getPosition, getHeading };
