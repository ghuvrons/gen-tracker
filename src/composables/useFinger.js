import {
  ADD_FINGERS,
  CLEAR_FINGERS,
  REMOVE_FINGERS,
} from "src/store/db/mutation-types";
import { extractCommand } from "src/js/command";
import dayjs from "src/js/dayjs";

import { useStore } from "vuex";

export default function ({ addDevices }) {
  const store = useStore();
  const addFingers = (v) => store.commit(ADD_FINGERS, v);
  const removeFingers = (v) => store.commit(REMOVE_FINGERS, v);
  const clearFingers = (v) => store.commit(CLEAR_FINGERS, v);

  const handleFinger = ({ payload, vin, message }) => {
    let { prop, value } = extractCommand(payload);

    if (prop == "FINGER_FETCH") {
      if (message.length > 0)
        message.split(",").forEach((fingerID) => addFingers({ vin, fingerID }));
      addDevices([{ vin, fingerTime: dayjs().unix() }]);
    } else if (prop == "FINGER_ADD") addFingers({ vin, fingerID: message });
    else if (prop == "FINGER_DEL") removeFingers({ vin, fingerID: value });
    else if (prop == "FINGER_RST") clearFingers({ vin });
  };

  return {
    handleFinger,
  };
}
