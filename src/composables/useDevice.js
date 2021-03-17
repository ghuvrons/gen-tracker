import { pushNotification } from "src/js/framework";
import { ADD_DEVICES } from "src/store/db/mutation-types";

import dayjs from "src/js/dayjs";
import { watch, computed } from "vue";
import { useStore } from "vuex";
import { log } from "src/js/utils";

export default function () {
  const store = useStore();
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const addDevices = (v) => store.commit(ADD_DEVICES, v);

  const handleStatus = (data, topic) => {
    const vin = parseInt(topic.split("/")[1]);
    const online = parseInt(data);
    log("warn", `${online ? "ONLINE" : "OFFLINE"} ${vin}`);
    addDevices([{ vin, online }]);
  };

  watch(
    () => devDevice.value,
    (curDev, oldDev) => {
      if (!curDev || !oldDev) return;
      if (curDev?.online == oldDev?.online) return;

      pushNotification(
        `DEVICE ${curDev?.online ? "ONLINE" : "OFFLINE"}`,
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
