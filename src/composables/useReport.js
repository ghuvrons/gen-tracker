import { parseReport } from "src/js/report";
import { dilation } from "src/js/utils";
import { INSERT_REPORTS } from "src/store/db/action-types";
import { SET_REPORT } from "src/store/db/mutation-types";

import { get } from "lodash";
import { watch } from "@vue/composition-api";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const {
  useState,
  useGetters,
  useMutations,
  useActions
} = createNamespacedHelpers("db");

export default function({ handleEvents, handleLostCommand }) {
  const { reports } = useState(["reports"]);
  const { devReports } = useGetters(["devReports"]);
  const { [SET_REPORT]: setReport } = useMutations([SET_REPORT]);
  const { [INSERT_REPORTS]: insertReports } = useActions([INSERT_REPORTS]);

  const common = createNamespacedHelpers("common");
  const { follow } = common.useState(["follow"]);

  const handleReport = hex => {
    let report = parseReport(hex);
    const { val: dt } = report.logDatetime;

    console.log(`REPORT ${hex}`);

    if (dilation(dt, "years") > 1) return console.error(`^REPORT (EXPIRED)`);

    if (reports.value.some(({ logDatetime }) => logDatetime.val == dt))
      return console.error(`^REPORT (DUPLICATE)`);

    insertReports(report);
    handleLostCommand(report);
  };

  watch(
    () => devReports.value[0],
    (curReport, oldReport) => {
      if (!curReport) return setReport(null);

      if (curReport.unitID.val != get(oldReport, "unitID.val") || follow.value)
        setReport(curReport);

      handleEvents(curReport, oldReport);
    },
    { lazy: false }
  );

  return {
    handleReport
  };
}