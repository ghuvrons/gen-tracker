import mqtt from "mqtt";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import { notify } from "src/js/framework";
import config from "src/js/opt/config";

export default function () {
  const $q = useQuasar();

  const client = ref(null);
  const listeners = ref(null);

  onMounted(() => {
    const { host, username, password } = config.mqtt;
    client.value = mqtt.connect(host, {
      clientId: getClientId(),
      username: username,
      password: password,
      clean: $q.platform.is.mobile,
      keepalive: 60,
      // protocolId: "MQTT",
      // protocolVersion: 4,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      // will: {
      //   topic: "WillMsg",
      //   payload: "Connection Closed abnormally..!",
      //   qos: 0,
      //   retain: false,
      // },
    });

    client.value.on("connect", () => notify(`Client connected`, "info"));
    client.value.on("reconnect", () => notify(`Reconnecting...`, "info"));
    client.value.on("error", (err) => {
      notify(`Connection error: ${err}`, "error");
      client.value.end();
    });
    client.value.on("message", (topic, data, packet) => {
      Object.keys(listeners.value).forEach(
        (listener) =>
          eq(topic, listener) && listeners.value[listener](data, topic)
      );
    });
  });
  onBeforeUnmount(() => {
    Object.keys(listeners.value).forEach((listener) => {
      delete listeners.value[listener];
    });

    client.value && client.value.end();
  });

  const subscribe = (topic, options) =>
    client.value && client.value.subscribe(topic, options);
  const unsubscribe = (topic) => {
    client.value &&
      client.value.unubscribe(topic, () => console.log("Unsubscribed"));
  };
  const publish = (topic, data, options) =>
    client.value && client.value.publish(topic, data, options);

  return {
    listeners,
    subscribe,
    unsubscribe,
    publish,
  };
}

const eq = (str1, str2) => {
  let arr1 = str1.split("/");
  let arr2 = str2.split("/");
  if (
    !str1.includes("#") &&
    !str2.includes("#") &&
    arr1.length !== arr2.length
  ) {
    return false;
  }
  if (arr2.length < arr1.length) {
    arr2 = str1.split("/");
    arr1 = str2.split("/");
  }
  let ret = true;
  arr1.forEach((val, i) => {
    if (
      val === "+" ||
      val === "#" ||
      (arr2[i] && arr2[i] === "+") ||
      (arr2[i] && arr2[i] === "#") ||
      (arr2[i] && arr2[i] === val)
    ) {
      return;
    }
    ret = false;
  });
  return ret;
};

const getClientId = () => {
  let clientId =
    window.localStorage.getItem("clientId") ||
    "mqttjs_" + Math.random().toString(16).substr(2, 8);
  window.localStorage.setItem("clientId", clientId);
  return clientId;
};
