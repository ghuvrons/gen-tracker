import { pushNotification } from "src/js/framework";

import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters } = createNamespacedHelpers("db");

export default function() {
  const { devDevice, devReports } = useGetters(["devDevice", "devReports"]);

  watch(
    () => devDevice.value,
    (curDevice, oldDevice) => {
      if (!oldDevice) return;
      const { status: oldStatus } = oldDevice;
      const { status: curStatus } = curDevice;

      if (oldStatus == curStatus) return;

      const [devReport] = devReports.value;
      pushNotification(
        `${devReport.unitID.val} -> ${curStatus ? "ON" : "OFF"}`,
        devReport.logDatetime.out
      );
    },
    {
      deep: true
    }
  );
}
