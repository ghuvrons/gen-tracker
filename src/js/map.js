import config from "src/data/config";
import { frameId } from "src/js/utils";

const isIndonesia = ({ lng, lat }) => {
  const { lngMin, lngMax, latMin, latMax } = config.map.borderIndonesia;
  return lng > lngMin && lng < lngMax && lat > latMin && lat < latMax;
};

const getPosition = (report) => {
  const pos = {
    ...config.map.centerIndonesia,
    valid: false,
  };

  if (report?.gpsActive?.val) {
    pos.lat = report?.gpsLatitude?.val;
    pos.lng = report?.gpsLongitude?.val;
    pos.valid = isIndonesia(pos) && report?.gpsHDOP?.val <= config.map.hdopMin;
  }

  return pos;
};

const getHeading = (report) => {
  return report?.gpsActive?.val ? report?.gpsHeading?.val : 0;
};

export { getPosition, getHeading };
