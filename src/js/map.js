import config from "src/js/opt/config";
import { frameId } from "src/js/utils";

const isIndonesia = ({ lng, lat }) => {
  let { borderIndonesia } = config.map;
  return (
    lng > borderIndonesia.lngMin &&
    lng < borderIndonesia.lngMax &&
    lat > borderIndonesia.latMin &&
    lat < borderIndonesia.latMax
  );
};

const getPosition = ({ frameID, gpsLatitude, gpsLongitude }) => {
  let pos = {
    ...config.map.centerIndonesia,
    valid: false
  };

  if (frameId(frameID.val) == "FULL") {
    pos.lat = gpsLatitude.val;
    pos.lng = gpsLongitude.val;
    pos.valid = isIndonesia(pos);
  }

  return pos;
};

const getHeading = ({ frameID, gpsHeading }) => {
  if (frameId(frameID.val) == "FULL") return gpsHeading.val;
  return 0;
};

export { getPosition, getHeading };
