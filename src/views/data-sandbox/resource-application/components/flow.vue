<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-24 10:48:53
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-07-24 11:34:01
 * @FilePath: \model-sandbox-frontend\src\views\dataset-management\my-application\components\flow.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="guide-container">
    <el-steps style="max-width: 640px" space="10" :active="1" finish-status="success" simple>
      <el-step title="申请创建数据集" />
      <el-step title="数据资源申请" />
      <el-step title="数据探查" />
    </el-steps>
    <div class="steps">
      <div class="step">
        <div class="step-icon">
          <!-- <img src="/src/assets/images/header.png" alt="icon" /> -->
          <img src="@/assets/images/step1.png" alt="icon" />
        </div>
        <div class="step-content">
          <div class="step-title">申请创建数据集</div>
          <div class="step-desc">填写信息</div>
          <el-button type="primary" @click="handleAdd">立即申请</el-button>
        </div>
      </div>
      <div class="step">
        <div class="step-icon">
          <img src="@/assets/images/step2.png" alt="icon" />
        </div>
        <div class="step-content">
          <div class="step-title">数据资源申请</div>
          <div class="step-desc">申请前请先开通数据集</div>
          <el-button disabled>立即前往</el-button>
        </div>
      </div>
      <!-- <div class="step">
        <div class="step-icon">
          <img src="@/assets/images/step3.png" alt="icon" />
        </div>
        <div class="step-content">
          <div class="step-title">数据探查</div>
          <div class="step-desc">探查前请先申请需要的数据资源</div>
          <el-button @click="handleView">立即前往</el-button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import Setp1 from '@/assets/images/step1.png'
// import Setp2 from '@/assets/images/step2.png'
// import Setp3 from '@/assets/images/step3.png'
import { useRouter } from 'vue-router'
const router = useRouter()
const emit = defineEmits(['add'])
// 此页面为引导页，无复杂逻辑
const handleAdd = () => {
  // 处理添加申请逻辑
  console.log('添加申请')
  emit('add')
}

const handleView = () => {
  // 处理查看数据探查逻辑
  console.log('前往数据探查')
  // 可以在这里添加路由跳转或其他逻辑
  router.push('/dataset-management/data-search')
}
</script>

<style scoped lang="postcss">
.guide-container {
  padding-bottom: 24px;
  .el-steps--simple {
    padding: 12px 24px;
  }
}
.steps {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 8px;
  margin-top: 24px;
}
.step {
  display: flex;
  align-items: center;
  width: 320px;
  position: relative;
}
.step-icon img {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}
.step-content {
  flex: 1;
  padding-left: 16px;
}
.step-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}
.step-desc {
  color: #888;
  margin-bottom: 16px;
}
.step-tip {
  color: #e74c3c;
  font-size: 14px;
  position: absolute;
  left: 0;
  bottom: -32px;
}
.bottom-section {
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  margin-top: 16px;
}
.my-list,
.data-catalog,
.report-link,
.other {
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 24px;
  min-width: 200px;
  text-align: center;
  font-size: 16px;
  background: #fafafa;
}
</style>
