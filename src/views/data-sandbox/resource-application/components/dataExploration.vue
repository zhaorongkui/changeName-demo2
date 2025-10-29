<!--
 数据探查
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
import DataExploration from '@/assets/images/dataExploration.png'

const emits = defineEmits(['close'])

const dialogVisible = ref(true)
const dialogTitle = ref('数据探索')
function handleClose() {
  emits('close')
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
img{
  width: 100%;
  height: 100%;
}
</style>
