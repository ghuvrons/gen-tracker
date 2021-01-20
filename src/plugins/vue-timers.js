// import something here
import VueTimers from 'vue-timers'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VueTimers)
}
