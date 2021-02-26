import {
  ADD_FINGERS,
  CLEAR_FINGERS,
  REMOVE_FINGERS
} from "src/store/db/mutation-types";
import { extractCommand } from "src/js/command";
import dayjs from "src/js/dayjs";

import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useMutations } = createNamespacedHelpers("db");

export default function({ insertDevices }) {
  const {
    [ADD_FINGERS]: addFingers,
    [REMOVE_FINGERS]: removeFingers,
    [CLEAR_FINGERS]: clearFingers
  } = useMutations([ADD_FINGERS, REMOVE_FINGERS, CLEAR_FINGERS]);

  const handleFinger = ({ payload, unitID, message }) => {
    let { prop, value } = extractCommand(payload);

    if (prop == "FINGER_FETCH") {
      if (message.length > 0)
        message
          .split(",")
          .forEach(fingerID => addFingers({ unitID, fingerID }));
      insertDevices({ unitID, fingerTime: dayjs().unix() });
    } else if (prop == "FINGER_ADD") addFingers({ unitID, fingerID: message });
    else if (prop == "FINGER_DEL") removeFingers({ unitID, fingerID: value });
    else if (prop == "FINGER_RST") clearFingers({ unitID });
  };

  return {
    handleFinger
  };
}
