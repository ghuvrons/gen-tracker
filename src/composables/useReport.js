import { parseReport } from "src/js/report";
import { dilation, log } from "src/js/utils";
import { notify } from "src/js/framework";
import { INSERT_REPORTS } from "src/store/db/action-types";
import { SET_REPORT } from "src/store/db/mutation-types";

import { watch, computed } from "vue";
import { useStore } from "vuex";
import config from "src/js/opt/config";

export default function ({ handleEvents }) {
  const store = useStore();
  const reports = computed(() => store.state.db.reports);
  const devDevice = computed(() => store.getters[`db/devDevice`]);
  const setReport = (v) => store.commit(SET_REPORT, v);
  const insertReports = (v) => store.dispatch(INSERT_REPORTS, v);
  const follow = computed(() => store.state.common.follow);

  const validate = (report) => {
    const { val: sdt } = report.sendDatetime ?? {};
    const { val: ldt } = report.logDatetime ?? {};

    if (reports.value.some(({ logDatetime }) => logDatetime.val == ldt)) {
      notify("Report duplicate", "info");
      return log("error", `^REPORT (DUPLICATE)`);
    }

    const sendDiff = Math.abs(dilation(sdt, "years"));
    const logDiff = Math.abs(dilation(ldt, "years"));
    if (sendDiff > 1 || (sendDiff <= 1 && logDiff > 1)) {
      notify("Report expired", "info");
      log("error", `^REPORT (EXPIRED)`);
    }

    return report;
  };
  const handleReports = (hexs) => {
    const reports = hexs.reduce((acc, hex) => {
      log("log", `REPORT ${hex}`);
      const report = parseReport(hex);

      if (!validate(report)) return acc;

      return [...acc, report];
    }, []);

    insertReports(reports);
  };

  watch(
    () => devDevice.value,
    (curDev, oldDev) => {
      const curReport = curDev?.lastReport;
      const oldReport = oldDev?.lastReport;

      if (!curReport) return setReport(null);

      if (curReport.vin.val != oldReport?.vin?.val || follow.value) {
        setReport(curReport);
      }

      handleEvents(curReport, oldReport);
    },
    { immediate: true, deep: true }
  );

  return {
    handleReports,
  };
}
