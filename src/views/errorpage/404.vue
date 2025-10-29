<!--
* @description 
* @fileName 404.vue
* @author zhangshufeng
* @date 2024/02/04 15:12:49
* @filePath src\views\errorpage\404.vue
-->
<template>
  <div class="not-found">
    <img src="@/assets/images/error/404.svg" alt="">
    <p>抱歉，您访问的页面不存在。</p>
  </div>
</template>

<script lang="ts" setup>
import {onMounted,onUpdated,onUnmounted} from 'vue'

  onMounted(() => {
    console.log('onMounted');
  })
  onUpdated(() => {
    console.log('onUpdated');
  })

  onUnmounted(() => {
    console.log('onUnmounted');
  })


</script>
<style lang='scss' scoped>
.not-found {
  width: 100%;
  height: auto;
  padding: 0 100px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  >img {
    width: 40%;
    min-width: 450px;
  }
}
</style>