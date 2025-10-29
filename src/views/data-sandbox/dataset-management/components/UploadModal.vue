<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-19 10:15:53
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-19 10:20:21
 * @FilePath: \model-sandbox-frontend\src\views\data-sandbox\dataset-management\components\UploadModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-model="visible"
    title="上传数据集"
    width="500px"
    :close-on-click-modal="false"
    fullscreen
    @close="handleClose"
  >
    <!-- 弹窗内容区域 -->
    <div class="modal-container">
      <!-- 这里放置表单或其他内容 -->
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // 定义需要的props
})

const emits = defineEmits(['close', 'success'])
const visible = ref(true)

function handleClose() {
  visible.value = false
  emits('close')
}

function handleConfirm() {
  // 确认逻辑
  handleClose()
}
</script>

<style lang="scss" scoped>
.modal-container {
  height: calc(100vh - 120px);
}
</style>
