<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-19 17:14:19
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-21 13:46:43
 * @FilePath: \model-sandbox-frontend\src\views\data-sandbox\resource-application\components\ReviewRecordModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="handleClose" fullscreen destroy-on-close :close-on-click-modal="false">
    <div class="modal-container">
      <div class="main-content">
        <el-tabs v-model="activeTab" class="demo-tabs" @tab-change="handleTabChange">
          <el-tab-pane label="审批记录" name="record"></el-tab-pane>
          <el-tab-pane label="流程图" name="preview"></el-tab-pane>
        </el-tabs>
        <div class="review-modal-content">
          <!-- 可在此处添加审批记录 流程图 -->
          <!-- todo 流程管理里有对应 组件 -->
          <img v-if="activeTab === 'record'" :src="recordImage" alt="" />
          <img v-if="activeTab === 'preview'" :src="flowImage" alt="" />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer text-center">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import recordImage from '@/assets/images/recordImage.png'
import flowImage from '@/assets/images/flowImage.png'

const dialogVisible = ref(true)
const dialogTitle = ref('审核记录')

const activeTab = ref('record')
function handleTabChange(tabName: string) {
  console.log(`当前选中的标签页: ${tabName}`)
}

function handleClose() {
  dialogVisible.value = false
}

function handleConfirm() {
  // 确认逻辑
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.modal-container {
  height: calc(100vh - 120px);
}
</style>
