<template>
  <div>
    <canvas ref="canvas" id="line-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { throttle } from 'lodash'
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
    // width: {
    //   default: 400,
    //   type: Number
    // },
    // height: {
    //   default: 400,
    //   type: Number
    // },
  },
  setup(props) {
    const charter = ref(null);
    const canvas = ref(null);

    const renderChart = throttle(() => {
      if (charter.value) charter.value.destroy();
      if (!canvas.value)
        throw new Error(
          "Please remove the <template></template> tags from your chart component. See https://vue-charter.org/guide/#vue-single-file-components"
        );
      charter.value = new Chart(canvas.value.getContext("2d"), {
        type: 'line',
        data: props.param.data,
        options: props.param.options,
      });
    }, 500);

    onMounted(() => renderChart()),
    onBeforeUnmount(() =>
      charter.value && charter.value.destroy()
    )

    watch(
      () => props.updateData,
      () => charter.value && charter.value.update()
    )

    watch(
      () => props.updateOptions,
      () => renderChart()
    )

    return {
      canvas
    }
  }
})
</script>

<style>

</style>
