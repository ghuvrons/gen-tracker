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

const genPosition = ({ frameID, lat, lng }) => {
  let pos = {
    ...config.map.centerIndonesia,
    valid: false,
  };

  if (frameID === config.frame.id.FULL) {
    pos.lat = lat;
    pos.lng = lng;
    pos.valid = isIndonesia(pos);
  }

  return pos;
};

const getHeading = ({ frameID, heading }) => {
  if (frameID === config.frame.id.FULL) return heading;
  return 0;
};

export { genPosition, getHeading };
