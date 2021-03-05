import { FREE_BUFFER, STOP_BUFFERING } from "src/store/db/mutation-types";
import { INSERT_BUFFERS } from "src/store/db/action-types";

import { onBeforeUnmount, onMounted, ref } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useMutations, useActions } = createNamespacedHelpers("db");

export default function({ handleReports }) {
  const interval = ref(null);

  const { buffers } = useState(["buffers"]);
  const {
    [FREE_BUFFER]: freeBuffer,
    [STOP_BUFFERING]: stopBuferring
  } = useMutations([FREE_BUFFER, STOP_BUFFERING]);
  const { [INSERT_BUFFERS]: insertBuffers } = useActions([INSERT_BUFFERS]);

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
    insertBuffers
  };
}
