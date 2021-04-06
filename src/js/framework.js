import { Dark, Dialog, Notify, QSpinnerGears } from "quasar";
import { log } from "./utils";

const pushNotification = (title, body) => {
  const { protocol, host } = window.location;
  const icon = `${protocol}//${host}/icons/favicon-32x32.png`;

  const swNotify = () => {
    if (!("serviceWorker" in navigator)) {
      log("error", "No service worker");
      return;
    }

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) registration.showNotification(title, { body, icon });
      else new Notification(title, { body, icon });
    });
  };

  if (!("Notification" in window)) {
    log("error", "No notification support");
    return;
  }

  if (Notification.permission === "granted") swNotify();
  else if (Notification.permission !== "denied")
    Notification.requestPermission().then(
      (permission) => permission === "granted" && swNotify()
    );
};

const notify = (message, type = "negative", timeout = 5000) => {
  return Notify.create({
    type,
    message,
    timeout,
    position: "bottom-right",
  });
};

const confirm = (message) => {
  return Dialog.create({
    message,
    title: "Confirmation",
    dark: Dark.isActive,
    preventClose: true,
    cancel: true,
  });
};

const loader = (title, message) => {
  return Dialog.create({
    title,
    message,
    dark: Dark.isActive,
    persistent: true,
    ok: false,
    progress: {
      spinner: QSpinnerGears,
      color: "primary",
    },
  });
};

export { pushNotification, notify, confirm, loader };
