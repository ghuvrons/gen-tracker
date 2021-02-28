import {
  ADD_BUFFERS,
  FREE_BUFFER,
  STOP_BUFFERING
} from "src/store/db/mutation-types";

import { onBeforeUnmount, onMounted, ref } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useMutations } = createNamespacedHelpers("db");

export default function({ handleReports }) {
  const interval = ref(null);

  const { buffers } = useState(["buffers"]);
  const {
    [ADD_BUFFERS]: addBuffers,
    [FREE_BUFFER]: freeBuffer,
    [STOP_BUFFERING]: stopBuferring
  } = useMutations([ADD_BUFFERS, FREE_BUFFER, STOP_BUFFERING]);

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
    addBuffers
  };
}
