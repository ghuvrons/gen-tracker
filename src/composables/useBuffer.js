import { ADD_BUFFERS, FREE_BUFFER } from "src/store/db/mutation-types";

import { onBeforeUnmount, onMounted, ref } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useState, useMutations } = createNamespacedHelpers("db");

export default function(handleReport) {
  const interval = ref(null);

  const { buffers } = useState(["buffers"]);
  const {
    [ADD_BUFFERS]: addBuffers,
    [FREE_BUFFER]: freeBuffer
  } = useMutations([ADD_BUFFERS, FREE_BUFFER]);

  const processBuffer = () => {
    if (buffers.value.length > 0) {
      const [hex] = buffers.value;
      freeBuffer();
      handleReport(hex);
    }
  };

  onMounted(() => (interval.value = setInterval(processBuffer, 100)));
  onBeforeUnmount(() => clearInterval(interval.value));

  return {
    addBuffers
  };
}
