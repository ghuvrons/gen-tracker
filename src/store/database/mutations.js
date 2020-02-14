export const CLEAR_ALL = (state) => {
  state.theUnit = null
  state.theReport = null
  state.units = []
  state.reports = []
  state.responses = []
  state.fingers = []
}

export const TOGGLE_TIME_CALIBRATION = (state) => {
  state.settings.timeCalibration = !state.settings.timeCalibration
}

export const SET_LOADING = (state, payload) => {
  state.loading = payload
}

export const SET_THE_REPORT = (state, payload) => {
  state.theReport = payload
}

export const SET_THE_UNIT = (state, payload) => {
  state.theUnit = payload
}

export const ADD_UNITS = (state, payload) => {
  // get unit
  let unit = state.units.find(el => el.unitID === payload.unitID)

  // check unit
  if (!unit) {
    // unit not exist add it
    if (!payload.fake) {
      state.units.unshift(payload)
    } else {
      // put fake on last index
      state.units.push(payload)
    }
    // check if theUnit is null
    if (!state.theUnit) {
      state.theUnit = payload
    }
  } else {
    if (unit.client !== payload.client) {
      // unit exist, but address is different (so update it)
      let unitIndex = state.units.findIndex(el => el.unitID === payload.unitID)
      // update the corresponding units
      state.units.splice(unitIndex, 1, payload)
      // update theUnit data
      if (state.theUnit) {
        if (state.theUnit.unitID === unit.unitID) {
          state.theUnit = payload
        }
      }
    }
  }
}

export const ADD_REPORTS = (state, payload) => {
  state.reports.unshift(payload)
}

export const ADD_RESPONSES = (state, payload) => {
  state.responses.unshift(payload)
}

export const ADD_FINGERS = (state, payload) => {
  state.fingers.unshift(payload)
}

export const DELETE_FINGERS = (state, payload) => {
  let index = state.fingers.findIndex(finger => {
    return finger.unitID === payload.unitID && finger.fingerID === payload.fingerID
  })
  state.fingers.splice(index, 1)
}

export const RESET_FINGERS = (state, payload) => {
  state.fingers = state.fingers.filter(el => el.unitID !== payload.unitID)
}
