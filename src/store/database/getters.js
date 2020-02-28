/*
export function someGetter (state) {
}
*/
export const getTotalReports = state => unitID => {
  return state.reports.filter(el => el.unitID === unitID).length
}

export const uniqueReport = state => (unitID, sequentialID) => {
  return !state.reports.find(el => {
    let seqID = el.data.find(el => el.field === 'sequentialID').value

    return el.unitID === unitID && seqID === sequentialID
  })
}

export const selectedReports = state => {
  return state.theUnit ? state.reports.filter(el => el.unitID === state.theUnit.unitID) : []
}

export const selectedResponses = state => {
  return state.theUnit ? state.responses.filter(el => el.unitID === state.theUnit.unitID) : []
}

export const selectedFingers = state => {
  return state.theUnit ? state.fingers.filter(el => el.unitID === state.theUnit.unitID) : []
}
