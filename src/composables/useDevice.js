import { pushNotification } from "src/js/framework";
import { ADD_DEVICES } from "src/store/db/mutation-types";

import dayjs from "src/js/dayjs";
import { watch, computed } from "vue";
import { useStore } from "vuex";

export default function () {
  const store = useStore();
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const addDevices = (v) => store.commit(ADD_DEVICES, v);

  const handleStatus = (data, topic) => {
    const vin = parseInt(topic.split("/")[1]);
    const status = parseInt(data);
    console.warn(`STATUS ${vin},${status}`);
    addDevices([{ vin, status }]);
  };

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
    { deep: true }
  );

  return {
    handleStatus,
    addDevices,
  };
}
