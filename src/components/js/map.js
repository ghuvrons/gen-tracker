import { config } from "components/js/opt/config";
import { getValue } from "components/js/utils";
import { parseReport } from "components/js/report";

const isIndonesia = ({ lng, lat }) => {
  let { borderIndonesia } = config.map;
  return (
    lng > borderIndonesia.lngMin &&
    lng < borderIndonesia.lngMax &&
    lat > borderIndonesia.latMin &&
    lat < borderIndonesia.latMax
  );
};

const genPosition = (frameID, data) => {
  let pos = {
    ...config.map.centerIndonesia,
    valid: false,
  };

  if (frameID === config.frame.id.FULL) {
    pos.lng = getValue(data, "gpsLongitude");
    pos.lat = getValue(data, "gpsLatitude");
    pos.valid = isIndonesia(pos);
  }

  return pos;
};

const getHeading = (frameID, data) => {
  if (frameID === config.frame.id.FULL) return getValue(data, "gpsHeading");
  return 0;
};

export { genPosition, getHeading };
