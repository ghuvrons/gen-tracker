export default function() {
  return {
    buffering: null,

    unitID: null,
    report: null,
    command: {
      payload: "",
      exec: false
    },

    commands: [],

    devices: [],
    buffers: [],
    reports: [],
    responses: [],
    fingers: []
  };
}
