export const CLEAR_ALL = (state) => {
  // state.theUnit = null
  state.theReport = null;

  // state.units = []
  state.reports = [];
  state.commands = [];
  // state.fingers = []
};

export const TOGGLE_TIME_CALIBRATION = (state) => {
  state.timeCalibration = !state.timeCalibration;
};

export const SET_LOADING = (state, payload) => {
  state.loading = payload;
};

export const SET_THE_COMMAND = (state, data) => {
  state.theCommand = data;
};

export const CLEAR_THE_COMMAND = (state) => {
  state.theCommand = null;
};

export const SET_THE_REPORT = (state, payload) => {
  state.theReport = payload;
};

export const SET_THE_UNIT = (state, payload) => {
  state.theUnit = payload;
};

export const ADD_UNITS = (state, payload) => {
  // get unit
  let unit = state.units.find(({ unitID }) => unitID === payload.unitID);

  // check unit
  if (!unit) {
    // unit not exist add it
    state.units.unshift(payload);
    // check if theUnit is null
    if (!state.theUnit) state.theUnit = payload;
  } else {
    let unitIndex = state.units.findIndex(
      ({ unitID }) => unitID === payload.unitID
    );
    // update the corresponding units
    state.units.splice(unitIndex, 1, payload);
    // update theUnit data
    if (state.theUnit)
      if (state.theUnit.unitID === unit.unitID) state.theUnit = payload;
  }
};

export const ADD_REPORTS = (state, payload) => {
  state.reports.unshift(payload);
};

export const ADD_COMMANDS = (state, payload) => {
  state.commands.unshift(payload);
};

export const ADD_FINGERS = (state, payload) => {
  state.fingers.unshift(payload);
};

export const DELETE_FINGERS = (state, payload) => {
  let index = state.fingers.findIndex(({ unitID, fingerID }) => {
    return unitID === payload.unitID && fingerID === payload.fingerID;
  });
  state.fingers.splice(index, 1);
};

export const RESET_FINGERS = (state, payload) => {
  state.fingers = state.fingers.filter(
    ({ unitID }) => unitID !== payload.unitID
  );
};
