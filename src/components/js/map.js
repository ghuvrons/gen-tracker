import config from "components/js/opt/config";

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
    valid: false,
  };

  if (frameID.val === config.frame.id.FULL) {
    pos.lat = gpsLatitude.val;
    pos.lng = gpsLongitude.val;
    pos.valid = isIndonesia(pos);
  }

  return pos;
};

const getHeading = ({ frameID, gpsHeading }) => {
  if (frameID.val === config.frame.id.FULL) return gpsHeading.val;
  return 0;
};

export { getPosition, getHeading };
