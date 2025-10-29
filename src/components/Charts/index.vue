<template>
  <div ref="canvasLeftEl" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeMount } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  optionData: Object,
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  }
})

const canvasLeftEl = ref(null);
let chart = null;
onMounted(() => {
  chart = echarts.init(canvasLeftEl.value);
  window.addEventListener('resize', initCharts);
  initCharts()
})
onBeforeMount(() => {
    window.removeEventListener('resize', initCharts);
    chart?.dispose();
    chart = null;
})
const initCharts = () => {
  chart.setOption(props.optionData)
}

watch(() => props.optionData, () => {
  initCharts()
},
{
  deep: true
})
</script>