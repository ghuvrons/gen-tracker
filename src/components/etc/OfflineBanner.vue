<template>
  <q-bar v-if="show" :class="`bg-${color}`" dense>
    <q-toolbar-title class="text-caption">
      {{ message }}
    </q-toolbar-title>
  </q-bar>
</template>

<script>
import { inject, reactive, toRefs, computed, watchEffect, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup(props) {
    const offline = inject("offline");
    const brokerOff = inject("brokerOff");

    const store = useStore();
    const devDevice = computed(() => store.getters[`db/devDevice`]);


    const banner = reactive({
      show: false,
      color: '',
      message: ''
    })

    watchEffect(() => {
      banner.show = offline.value || brokerOff.value || !devDevice.value?.online
      banner.color = offline.value ? 'red' : brokerOff.value ? 'orange' : 'amber'
      banner.message = offline.value ? 'Internet offline' : brokerOff.value ? 'Broker disconnected' : devDevice.value ? 'Device offline' : 'No Device'
    })

    return {
      ...toRefs(banner)
    }
  }
})
</script>

<style>

</style>
