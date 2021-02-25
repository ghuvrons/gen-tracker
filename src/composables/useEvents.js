import { readEvent } from "src/js/event";
import { pushNotification } from "src/js/framework";
import { createNamespacedHelpers } from "vuex-composition-helpers";

export default function() {
  const { useState } = createNamespacedHelpers("common");
  const { notification } = useState(["notification"]);

  const handleEvents = (curReport, oldReport) => {
    if (!notification.value) return;
    if (!oldReport) return;

    let curEvents = readEvent(curReport.eventsGroup);
    let oldEvents = readEvent(oldReport.eventsGroup);
    let newEvents = curEvents.filter(evt => !oldEvents.includes(evt));

    newEvents.forEach(evt => pushNotification(evt, curReport.logDatetime.out));
  };

  return {
    handleEvents
  };
}
