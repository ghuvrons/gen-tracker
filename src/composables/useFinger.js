import {
  ADD_FINGERS,
  CLEAR_FINGERS,
  REMOVE_FINGERS,
  TAKE_DEV_FINGER
} from "src/store/db/mutation-types";
import { extractCommand } from "src/js/command";

import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useMutations } = createNamespacedHelpers("db");

export default function() {
  const {
    [ADD_FINGERS]: addFingers,
    [REMOVE_FINGERS]: removeFingers,
    [CLEAR_FINGERS]: clearFingers,
    [TAKE_DEV_FINGER]: takeDevFinger
  } = useMutations([
    ADD_FINGERS,
    REMOVE_FINGERS,
    CLEAR_FINGERS,
    TAKE_DEV_FINGER
  ]);

  const handleFinger = ({ payload, unitID, message }) => {
    let { prop, value } = extractCommand(payload);

    if (prop == "FINGER_FETCH") {
      takeDevFinger(unitID);
      if (message.length > 0)
        message
          .split(",")
          .forEach(fingerID => addFingers({ unitID, fingerID }));
    } else if (prop == "FINGER_ADD") addFingers({ unitID, fingerID: message });
    else if (prop == "FINGER_DEL") removeFingers({ unitID, fingerID: value });
    else if (prop == "FINGER_RST") clearFingers({ unitID });
  };

  return {
    handleFinger
  };
}
