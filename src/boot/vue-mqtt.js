import VueMqtt from "vue-mqtt";
import { Platform, LocalStorage } from "quasar";
import config from "src/js/opt/config";
const { mqtt } = config;

// leave the export, even if you don't use it
export default ({ app, router, store, Vue }) => {
  let clientId = LocalStorage.getItem("clientId");
  if (!clientId) {
    clientId =
      "mqttjs_" +
      Math.random()
        .toString(16)
        .substr(2, 8);
    LocalStorage.set("clientId", clientId);
  }

  Vue.use(VueMqtt, mqtt.host, {
    username: mqtt.username,
    password: mqtt.password,
    clean: Platform.is.mobile,
    clientId
  });
};
