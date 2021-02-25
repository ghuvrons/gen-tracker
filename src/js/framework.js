import { Dark } from "quasar";
import { Dialog } from "quasar";
import { Notify } from "quasar";
import { QSpinnerGears } from "quasar";

const pushNotification = (title, body) => {
  const showNotification = () => new Notification(title, { body });

  if (Notification.permission === "granted") showNotification();
  else if (Notification.permission !== "denied")
    Notification.requestPermission().then(
      permission => permission === "granted" && showNotification()
    );
};

const notify = (message, type = "negative", timeout = 5000) => {
  return Notify.create({
    type,
    message,
    timeout
  });
};

const confirm = message => {
  return Dialog.create({
    message,
    title: "Confirmation",
    dark: Dark.isActive,
    preventClose: true,
    cancel: true
  });
};

const loader = title => {
  return Dialog.create({
    title,
    message: "0%",
    dark: Dark.isActive,
    persistent: true,
    ok: false,
    progress: {
      spinner: QSpinnerGears,
      color: "primary"
    }
  });
};

export { pushNotification, notify, confirm, loader };
