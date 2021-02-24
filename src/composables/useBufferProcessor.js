import { ADD_BUFFERS, FREE_BUFFER } from "src/store/db/mutation-types";
import { INSERT_REPORTS } from "src/store/db/action-types";
import { parseReport } from "src/js/report";
import { dilation } from "src/js/utils";

import { onBeforeUnmount, onMounted, ref } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default function() {
  const interval = ref(null);

  const { useState, useMutations, useActions } = createNamespacedHelpers("db");
  const { reports, buffers } = useState(["reports", "buffers"]);
  const {
    [ADD_BUFFERS]: addBuffers,
    [FREE_BUFFER]: freeBuffer
  } = useMutations([ADD_BUFFERS, FREE_BUFFER]);
  const { [INSERT_REPORTS]: insertReports } = useActions([INSERT_REPORTS]);

  const handleReport = hex => {
    let report = parseReport(hex);
    const { val: dt } = report.logDatetime;

    if (dilation(dt, "years") > 1) return console.error(`^REPORT (EXPIRED)`);

    if (reports.value.some(({ logDatetime }) => logDatetime.val == dt))
      return console.error(`^REPORT (DUPLICATE)`);

    insertReports(report);
  };
  const process = () => {
    if (buffers.value.length > 0) {
      const [hex] = buffers.value;
      freeBuffer();
      console.log(`REPORT ${hex}`);
      handleReport(hex);
    }
  };

  onMounted(() => (interval.value = setInterval(process, 100)));
  onBeforeUnmount(() => clearInterval(interval.value));

  return {
    addBuffers
  };
}
