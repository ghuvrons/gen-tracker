import VueSocketIO from 'vue-socket.io'
import { config } from 'components/js/config'

// leave the export, even if you don't use it
export default ({ app, router, store, Vue }) => {
  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: `http://${config.socket.address}:${config.socket.port}`,
      vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
      }
    })
  )
}
