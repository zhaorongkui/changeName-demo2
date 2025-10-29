<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-19 09:18:16
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-19 09:28:21
 * @FilePath: \model-sandbox-frontend\src\views\data-sandbox\resource-application\components\DataExplorationModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="handleClose" fullscreen destroy-on-close :close-on-click-modal="false">
    <!-- 内容区域 -->
    <div class="modal-container">
      <!-- 可在此处添加内容 -->
      <img :src="DataExploration" alt="" />
    </div>
    <template #footer>
      <div class="dialog-footer text-center">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataExploration from '@/assets/images/data-exploration.png'

const emits = defineEmits(['close'])

const dialogVisible = ref(true)
const dialogTitle = ref('数据探索')
function handleClose() {
  dialogVisible.value = false
}
function handleSubmit() {
  // 提交逻辑
  dialogVisible.value = false
}
</script>

<style scoped>
.modal-container {
  height: calc(100vh - 120px);
}
</style>
