import { Dark } from "quasar";
import { Dialog } from "quasar";
import { Notify } from "quasar";
import { QSpinnerGears } from "quasar";

const notify = (message, type = "negative") => {
  return Notify.create({
    type,
    message,
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

const loader = (title) => {
  return Dialog.create({
    title,
    message: "0%",
    dark: Dark.isActive,
    persistent: true,
    ok: false,
    progress: {
      spinner: QSpinnerGears,
      color: "primary",
    },
  });
};

export { notify, confirm, loader };
