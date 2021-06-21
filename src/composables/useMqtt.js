import mqtt from "mqtt";
import { ref, onBeforeUnmount } from "vue";
import { notify } from "src/js/framework";
import { log } from "src/js/utils";
import { useQuasar } from "quasar";
import config from "src/data/config";

export default function () {
  const $q = useQuasar();

  const brokerOff = ref(true);
  const listeners = ref([]);

  const { host, username, password } = config.mqtt;
  const client = mqtt.connect(host, {
    clientId: getClientId(),
    username: username,
    password: password,
    clean: true, //$q.platform.is.mobile,
    keepalive: 60,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    // protocolId: "MQTT",
    // protocolVersion: 4,
    // will: {
    //   topic: "WillMsg",
    //   payload: "Connection Closed abnormally..!",
    //   qos: 0,
    //   retain: false,
    // },
  });
  onBeforeUnmount(() => {
    client?.end();
    listeners.value.forEach((listener, i) => delete listeners.value[i]);
  });

  client.on("connect", () => (brokerOff.value = false));
  client.on("offline", () => (brokerOff.value = true));
  client.on("reconnect", () => notify(`Broker reconnecting...`, "info"));
  client.on("error", (err) => {
    client.end();
    notify(`Broker error: ${err}`, "error");
  });
  client.on("message", (topic, data, packet) =>
    listeners.value.forEach(
      ({ name, callback }) => eq(topic, name) && callback(data, topic)
    )
  );

  const subscribe = (topic, options, callback) => {
    listeners.value.push({
      name: topic,
      callback,
    });
    client?.subscribe(topic, options);
  };
  const unsubscribe = (topic) =>
    client?.unubscribe(topic, () => log("log", `${topic} unsubscribed`));
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
