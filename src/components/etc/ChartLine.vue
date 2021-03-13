<template>
  <div>
    <canvas ref="canvas" id="line-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { debounce } from 'lodash'
import { defineComponent, watch, onMounted, onBeforeUnmount, ref } from "vue";

export default defineComponent({
  props: {
    param: {
      type: Object,
      required: true
    },
    updateData: {
      type: Boolean,
      required: true
    },
    updateOptions: {
      type: Boolean,
      required: true
    },
  },
  setup(props) {
    const charter = ref(null);
    const canvas = ref(null);

    const renderChart = () => {
      charter.value?.destroy();
      if (canvas.value && !charter.value)
        charter.value = new Chart(canvas.value.getContext("2d"), {
          type: 'line',
          data: props.param.data,
          options: props.param.options,
        });
    };

    onMounted(() => renderChart())
    onBeforeUnmount(() => charter.value?.destroy())

    watch(
      () => props.updateData,
      () => {
        if (!charter.value) return;
        charter.value.data = {
          ...charter.value.data,
          ...props.param.data
        }
        charter.value.update()
      }
    )

    watch(
      () => props.updateOptions,
      // () => renderChart()
      () => {
        if (!charter.value) return;
        charter.value.options = {
          ...charter.value.options,
          ...props.param.options
        }
        charter.value.update()}
    )

    return {
      canvas
    }
  }
})
</script>

<style>

</style>
