<!--
 * @Author: lihuihui
 * @Date: 2025-09-02 13:18:21
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-09-05 13:40:15
 * @Description: 用户协议与隐私声明弹窗
-->
<template>
  <div class="agreement-modal" v-if="show">
    <div class="agreement-content">
      <div class="agreement-header">
        <div class="close-btn" @click="closeDialog">
          <!-- <i class="fas fa-times"></i> -->
          <el-icon><Close /></el-icon>
        </div>
        <h2>用户协议与隐私声明</h2>
        <p class="tips">请仔细阅读以下内容，继续使用代表您已同意本协议</p>
      </div>

      <div class="agreement-body">
        <h3>尊敬的用户：</h3>
        <p>欢迎您使用我们的服务，在您开始使用我们的忠虫网服务（以下简称"本服务"）之前，请仔细阅读本用户协议与隐私声明（以下简称"本协议"）。本协议阐述了用户（以下简称"您"）与我们之间的权利和义务。</p>

        <h3>一、我们的权利</h3>
        <p>1、本协议构成您与我们之间使用本服务的完整协议，并取代之前的任何口头或书面协议。</p>
        <p>2、我们有权根据业务发展需求，对服务内容进行调整或更新，而无需单独通知用户。</p>
        <p>3、我们拥有本软件及相关服务的知识产权，未经书面许可，您不得修改、复制、传播、出售或用于其他商业用途。</p>

        <h3>二、用户行为</h3>
        <p>1、您在使用服务时，必须遵守法律法规，不得从事任何违法、违规或侵犯他人利益的行为。</p>
        <p>2、不得干扰、破坏服务的正常运行，不得对服务进行反向工程、反编译或试图获取服务的源代码。</p>
        <p>3、不得使用本服务从事任何违法、有害、欺诈、侵权或其他不当活动。</p>
        <p>4、您在使用本服务时需要连接互联网，可能会产生不可预知的因素，如不稳定的网络环境、信息传输的加密行等，请您自行承担相应风险。</p>

        <h3>三、隐私保护</h3>
        <p>1、我们尊重您的隐私，将采取合理的安全措施保护您的个人信息。</p>
        <p>2、我们可能会收集您在使用服务过程中的某些信息，但会按照法律法规的要求进行处理和使用，并严格保密。</p>
        <p>3、我们不会将您的信息出售给第三方，但在某些情况下，可能会与合作伙伴共享必要的信息，以提供更好的服务。同时，第三方需同意承担与我们同等保护用户的隐私责任。</p>

        <h3>四、免责声明</h3>
        <p>1、对于因不可抗力、系统故障、网络问题等导致的服务中断或数据丢失，我们不承担责任。</p>
        <p>2、对于您使用服务而产生直接或间接的损失，包括但不限于数据丢失、利润损失、业务中断等，我们不承担赔偿责任。</p>

        <h3>五、协议终止</h3>
        <p>1、如果您违反本协议的任何规定，我们有权终止您的账号并停止提供服务。</p>
        <p>2、您有权随时停止使用服务，但在终止前的行为仍需遵守本协议。</p>

        <h3>六、争议解决</h3>
        <p>如您违反协议约定，我们有权追究违约责任并要求全部损失的赔偿。如双方因本协议产生争议，应通过友好协商解决，协商不成的，任一方有权将争议提交至我方住所地法院。</p>

        <p>再次感谢您选择使用我们的服务！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Close} from '@element-plus/icons-vue'
const { show } = defineProps({
  show: {
    type: Boolean,
    default: false, // 展示弹窗
  },
})
const emit = defineEmits(['update:show'])

const closeDialog = () => {
  emit('update:show', false)
}
</script>

<style lang="css" scoped>


.agreement-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.agreement-content {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.agreement-header {
  /* background: linear-gradient(90deg, #2c3e50 0%, #3498db 100%); */
  background: linear-gradient(90deg, var(--el-color-primary) 0%, var(--el-color-primary-light-5) 100%);
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
  flex-shrink: 0;
  .tips {
    font-size: 12px;
    color: #ddd;
  }
}

.agreement-header h2 {
  font-size: 22px;
  margin-bottom: 5px;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.agreement-body {
  padding: 20px;
  overflow-y: auto;
  line-height: 1.7;
  color: #34495e;
  flex-grow: 1;
}

.agreement-body h3 {
  color: #2c3e50;
  font-size: 18px;
  margin: 20px 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.agreement-body p {
  margin-bottom: 15px;
  text-align: justify;
}

.agreement-body ul {
  padding-left: 24px;
  margin-bottom: 15px;
}

.agreement-body li {
  margin-bottom: 10px;
}

@media (max-width: 900px) {
  .agreement-content {
    max-width: 100%;
  }

  .agreement-body {
    padding: 15px;
  }

  .agreement-header h2 {
    font-size: 20px;
  }
}
</style>
