import { FREE_BUFFER, STOP_BUFFERING } from "src/store/db/mutation-types";
import { INSERT_BUFFERS } from "src/store/db/action-types";

import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useStore } from "vuex";

export default function ({ handleReports }) {
  const store = useStore();
  const buffers = computed(() => store.state.db.buffers);
  const freeBuffer = (v) => store.commit(`db/${FREE_BUFFER}`, v);
  const stopBuferring = (v) => store.commit(`db/${STOP_BUFFERING}`, v);
  const insertBuffers = (v) => store.dispatch(`db/${INSERT_BUFFERS}`, v);

  const interval = ref(null);

  const processBuffer = () => {
    if (buffers.value.length > 0) {
      const hexs = buffers.value;
      handleReports(hexs);
      freeBuffer(hexs);
    } else stopBuferring();
  };

  onMounted(() => (interval.value = setInterval(processBuffer, 1000)));
  onBeforeUnmount(() => clearInterval(interval.value));

  return {
    insertBuffers,
  };
}
