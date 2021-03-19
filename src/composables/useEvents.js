import { readEvent } from "src/js/event";
import { EVENT_GROUP_BIT } from "src/js/opt/event";
import { pushNotification } from "src/js/framework";
import { useStore } from "vuex";
import { computed } from "vue";

export default function () {
  const store = useStore();
  const notification = computed(() => store.state.common.notification);

  const handleEvents = (curReport, oldReport) => {
    if (!notification.value) return;
    if (!oldReport) return;

    const curEvents = readEvent(EVENT_GROUP_BIT, curReport.eventsGroup);
    const oldEvents = readEvent(EVENT_GROUP_BIT, oldReport.eventsGroup);
    const newEvents = curEvents.filter((evt) => !oldEvents.includes(evt));

    newEvents.forEach((evt) =>
      pushNotification(evt, curReport.logDatetime.out)
    );
  };

  return {
    handleEvents,
  };
}
