<template>
  <el-config-provider :locale="zhCn">
    <div class="flex flex-col app-content relative" v-loading="!isMounted" id="app">
      <!-- <TopView /> -->
      <div v-if="isMounted" class="body-content" :class="{ setWidth: currentPath }">
        <router-view />
      </div>
    </div>
  </el-config-provider>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useRoute } from 'vue-router'
import TokenInfo from '@/hooks/tokenStatus'

const route = useRoute()
const { setToken } = TokenInfo()
// 模型和数据集列表页面设置宽度
const currentPath = computed(() => {
  return route.path === '/model-list' || route.path === '/data-list'
})
const updateSelectOrg = (e) => {
  // if (e?.data?.token) {
  //   setToken(e?.data?.token)
  // }
}
const isMounted = ref(false)
onMounted(() => {
  // setToken(
  //   ''
  //   )
  window.addEventListener('message', updateSelectOrg)
  nextTick(() => {
    isMounted.value = true
  })
})
onUnmounted(() => {
  window.removeEventListener('message', updateSelectOrg)
})
</script>
<style lang="postcss">
#app {
  min-width: 1200px !important;
  margin: 0 auto;
}
.app-content {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5fa;
  background-image: url('./assets/images/top_view/background.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  .body-content {
    @apply w-full overflow-auto h-full;
    &.setWidth {
      @apply min-w-[1280px] max-w-[1600px] mx-auto py-5;
    }
  }
}
/*
  * dialog统一样式设置
  */
.el-dialog {
  @apply p-0;
  .el-dialog__header {
    @apply h-[50px] leading-[50px] !py-0 text-[14px];
  }
  .el-dialog__body {
    @apply overflow-auto !p-0;
    background-color: #f5f5fa;
  }
  .el-dialog__footer {
    @apply h-[50px] leading-[50px] !py-0 px-6;
  }
}
/* 统一tabs样式 */
/* .el-tabs {
  .el-tabs__item.is-top {
    @apply p-0;
  }
  .el-tabs__header {
    @apply mb-0;
    .el-tabs__item.is-top {
      span {
        @apply px-5;
      }
    }
  }
  .el-tabs__content {
    @apply flex-1;
    .el-tab-pane{
      @apply h-full;
    }
  }
} */
.el-drawer {
  .el-drawer__header {
    @apply h-[50px] leading-[50px] !py-0 text-[14px] border-b-2;
    background-color: rgb(241, 241, 241);
  }
}
</style>
