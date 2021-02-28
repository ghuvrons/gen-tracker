import { get } from "lodash";
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

const getPosition = report => {
  let pos = {
    ...config.map.centerIndonesia,
    valid: false
  };

  if (frameId(get(report, "frameID.val")) == "FULL") {
    pos.lat = get(report, "gpsLatitude.val");
    pos.lng = get(report, "gpsLongitude.val");
    pos.valid = isIndonesia(pos);
  }

  return pos;
};

const getHeading = report => {
  if (frameId(get(report, "frameID.val")) == "FULL")
    return get(report, "gpsHeading.val");
  return 0;
};

export { getPosition, getHeading };
