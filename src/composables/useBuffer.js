import { FREE_BUFFER, STOP_BUFFERING } from "src/store/db/mutation-types";
import { INSERT_BUFFERS } from "src/store/db/action-types";
import { validateFrame } from "src/js/frame";
import config from "src/data/config";

import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { log } from "src/js/utils";

export default function ({ handleReports }) {
  const store = useStore();
  const buffers = computed(() => store.state.db.buffers);
  const freeBuffer = (v) => store.commit(FREE_BUFFER, v);
  const stopBuferring = (v) => store.commit(STOP_BUFFERING, v);
  const insertBuffers = (v) => store.dispatch(INSERT_BUFFERS, v);

  const interval = ref(null);

  const processBuffer = () => {
    if (buffers.value.length > 0) {
      const hexs = buffers.value;
      handleReports(hexs);
      freeBuffer(hexs);
    } else stopBuferring();
  };
  const handleBuffer = (data, topic) => {
    const hex = data.toString("hex").toUpperCase();
    if (!hex) return;
    if (!validateFrame(hex, config.prefix.report)) {
      log("error", `REPORT (CORRUPT) ${hex}`);
      return;
    }
    insertBuffers([hex]);
  };

  onMounted(() => (interval.value = setInterval(processBuffer, 1000)));
  onBeforeUnmount(() => clearInterval(interval.value));

  return {
    handleBuffer,
  };
}
