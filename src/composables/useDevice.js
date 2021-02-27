import { pushNotification } from "src/js/framework";
import { INSERT_DEVICES } from "src/store/db/action-types";

import dayjs from "src/js/dayjs";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters, useActions } = createNamespacedHelpers("db");

export default function() {
  const { devDevice } = useGetters(["devDevice"]);
  const { [INSERT_DEVICES]: insertDevices } = useActions([INSERT_DEVICES]);

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
    insertDevices
  };
}
