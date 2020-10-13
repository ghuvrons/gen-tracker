export const TOGGLE_TIME_CALIBRATION = state => {
  state.settings.timeCalibration = !settings.timeCalibration;
};

export const SET_LOADING = (state, payload) => {
  state.loading = payload;
};
