import mqtt from "mqtt";
import { ref, onBeforeUnmount } from "vue";
import { Platform } from "quasar";
import { notify } from "src/js/framework";
import config from "src/js/opt/config";

export default function () {
  const listeners = ref(null);
  const brokerOff = ref(true);

  const { host, username, password } = config.mqtt;
  const client = mqtt.connect(host, {
    clientId: getClientId(),
    username: username,
    password: password,
    clean: Platform.is.mobile,
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
  onBeforeUnmount(() => {
    client?.end();
    Object.keys(listeners.value).forEach(
      (listener) => delete listeners.value[listener]
    );
  });

  client.on("connect", () => {
    brokerOff.value = false;
    notify(`Broker connected`, "info");
  });
  client.on("offline", () => {
    brokerOff.value = true;
    notify(`Broker disconnected`, "info");
  });
  client.on("reconnect", () => notify(`Broker reconnecting...`, "info"));
  client.on("error", (err) => {
    notify(`Broker error: ${err}`, "error");
    client.end();
  });
  client.on("message", (topic, data, packet) =>
    Object.keys(listeners.value).forEach(
      (listener) =>
        eq(topic, listener) && listeners.value[listener](data, topic)
    )
  );

  const subscribe = (topic, options, callback) => {
    listeners.value = {
      ...listeners.value,
      [topic]: callback,
    };
    client?.subscribe(topic, options);
  };
  const unsubscribe = (topic) =>
    client?.unubscribe(topic, () => console.log(`${topic} unsubscribed`));
  const publish = (topic, data, options) =>
    client?.publish(topic, data, options);

  return {
    brokerOff,

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
  const clientId =
    window.localStorage.getItem("clientId") ??
    "mqttjs_" + Math.random().toString(16).substr(2, 8);
  window.localStorage.setItem("clientId", clientId);
  return clientId;
};
