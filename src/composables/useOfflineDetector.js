import { ref, onMounted, onBeforeUnmount } from "vue";

export default function () {
  const offline = ref(false);

  const onlineHandler = () => (offline.value = false);
  const offlineHandler = () => (offline.value = true);

  onMounted(() => {
    offline.value = !navigator.onLine;

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("online", onlineHandler);
    window.removeEventListener("offline", offlineHandler);
  });

  return {
    offline,
  };
}
