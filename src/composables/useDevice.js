import { pushNotification } from "src/js/framework";
import { ADD_DEVICES } from "src/store/db/mutation-types";

import dayjs from "src/js/dayjs";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters, useMutations } = createNamespacedHelpers("db");

export default function() {
  const { devDevice } = useGetters(["devDevice"]);
  const { [ADD_DEVICES]: addDevices } = useMutations([ADD_DEVICES]);

  watch(
    () => devDevice.value,
    (curDev, oldDev) => {
      if (!curDev || !oldDev) return;
      const { status: oldStatus } = oldDev;
      const { status: curStatus } = curDev;

      if (oldStatus == curStatus) return;

      pushNotification(
        `DEVICE ${curStatus ? "ONLINE" : "OFFLINE"}`,
        dayjs().format("ddd, DD-MM-YY HH:mm:ss")
      );
    },
    {
      deep: true
    }
  );

  return {
    devDevice,
    addDevices
  };
}
