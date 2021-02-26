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
    (curDevice, oldDevice) => {
      if (!curDevice || !oldDevice) return;
      const { status: oldStatus } = oldDevice;
      const { status: curStatus } = curDevice;

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
