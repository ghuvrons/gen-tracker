import VueMqtt from 'vue-mqtt'
import { config } from 'components/js/config'

// leave the export, even if you don't use it
export default ({ app, router, store, Vue }) => {
  Vue.use(VueMqtt, `ws://${config.socket.address}:${config.socket.port}/mqtt`, {
    username: 'garda',
    password: 'energi'
  })
}
