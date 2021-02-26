import { Dark, Dialog, Notify, QSpinnerGears } from "quasar";

const pushNotification = (title, body) => {
  const { location } = window;
  const icon = `${location.protocol}//${location.host}/icons/favicon-32x32.png`;
  const showNotification = () => new Notification(title, { body, icon });

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
