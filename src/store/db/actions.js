import * as actions from "./action-types";
import * as mutations from "./mutation-types";
import { SET_PROCESSING } from "src/store/common/mutation-types";
import { frameId } from "src/js/utils";
import { buildCommand, parseCommand } from "src/js/command";
import { notify } from "src/js/framework";
import { mergeResponse } from "src/js/response";

export default {
  [actions.INSERT_BUFFERS]({ state, commit }, payloads) {
    if (payloads.length > 1) commit(mutations.START_BUFFERING);

    commit(mutations.ADD_BUFFERS, payloads);
  },
  [actions.INSERT_REPORTS]({ state, commit }, payloads) {
    if (payloads.length > 1) commit(mutations.START_BUFFERING);

    commit(mutations.ADD_REPORTS, payloads.slice().reverse());

    commit(
      mutations.ADD_DEVICES,
      payloads.map(payload => ({
        unitID: payload.unitID.val,
        sendDatetime: payload.sendDatetime.val,
        lastReport: payload,
        ...(frameId(payload.frameID.val) == "FULL" && {
          lastFullReport: payload
        })
      }))
    );
  },
  [actions.INSERT_RESPONSES]({ state, commit, dispatch }, payload) {
    commit(mutations.ADD_RESPONSES, payload);
    // commit(mutations.ADD_DEVICES, [
    //   {
    //     unitID: payload.unitID,
    //     lastResponse: payload
    //   }
    // ]);
  },
  [actions.INSERT_COMMAND]({ state, commit, getters }, payload) {
    // if (!getters.devDevice || !state.commandable) {
    // stopWaitting();
    if (!payload) return notify("No payload");
    if (!getters.devDevice) return notify("No device");
    if (!getters.devDevice.status) return notify("Device offline");
    if (!getters.devDevice.commandable) return notify("Device busy");
    // if (executor.value) return notify("Command busy.");
    // }

    payload = payload.toUpperCase();
    const cmd = parseCommand(payload);
    if (typeof cmd === "string")
      // stopWaitting();
      return notify(cmd);

    const { unitID } = getters.devDevice;
    const hexCmd = buildCommand(cmd, unitID);
    const command = {
      ...cmd,
      unitID,
      payload,
      hexCmd
    };

    commit(mutations.ADD_COMMANDS, command);
    // commit(`common/${SET_PROCESSING}`, true, { root: true });

    commit(mutations.ADD_DEVICES, [
      {
        unitID,
        commanding: true,
        lastCommand: command
      }
    ]);
  },
  [actions.INSERT_RESPONSE]({ state, commit }, payload) {
    // insert response to first devCommands
    commit(mutations.ADD_RESPONSE, payload);

    // FIXME: only execute on success response
    commit(mutations.ADD_DEVICES, [
      {
        unitID: payload.unitID,
        commanding: false,
        lastCommand: payload
      }
    ]);
  },
  [actions.CANCEL_COMMAND]({ state, commit, getters, dispatch }) {
    const response = mergeResponse(getters.devDevice.lastCommand, null);
    console.warn(response);
    dispatch(actions.INSERT_RESPONSE, response);
  }
};
