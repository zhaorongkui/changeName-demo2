<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-25 09:22:27
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-07-25 09:44:21
 * @FilePath: \model-sandbox-frontend\src\views\model-management\editor\components\settingDrawer\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="custom-drawer-container">
    <div class="custom-drawer-mask" v-if="isVisible" @click="closeOnClickMask && handleClose()"></div>
    <transition name="drawer-slide">
      <div v-if="isVisible" class="custom-drawer setting-drawer" ref="drawerRef">
        <div class="drawer-content">
          <div class="drawer-header">
            <h3 class="title">设置</h3>
            <div class="actions">
              <button class="drawer-close" @click="handleClose">×</button>
            </div>
          </div>
          <div class="drawer-body">
            <slot>
              <span>这里是抽屉内容</span>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineEmits, onMounted, onBeforeUnmount } from 'vue'

const isVisible = ref(false)
const drawerRef = ref(null)
const closeOnClickMask = ref(true)
const emit = defineEmits(['close'])

function open() {
  isVisible.value = true
}

function handleClose() {
  setTimeout(() => {
    isVisible.value = false
    emit('close')
  }, 50)
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isVisible.value) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

defineExpose({ open })
</script>

<style scoped>
.custom-drawer-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  pointer-events: none;
}
.custom-drawer-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
.custom-drawer {
  pointer-events: auto;
  position: absolute;
  top: 0;
  right: 0;
  width: 30vw;
  min-width: 300px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
.drawer-slide-enter-to,
.drawer-slide-leave-from {
  transform: translateX(0);
}
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #333;
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  font-size: 18px;
  border-bottom: 1px solid #f0f0f0;
}
.drawer-header .title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  color: #333;
}
.drawer-header .actions {
  display: flex;
  align-items: center;
}
.drawer-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
.drawer-body {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
