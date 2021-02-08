import VueMqtt from "vue-mqtt";
import config from "components/js/opt/config";
let { mqtt } = config;

// leave the export, even if you don't use it
export default ({ app, router, store, Vue }) => {
  Vue.use(VueMqtt, `wss://${mqtt.address}:${mqtt.port}${mqtt.path}`, {
    username: mqtt.username,
    password: mqtt.password,
  });
};
