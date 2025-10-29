
<template>
  <TopView></TopView>
  <div class="backend-setting">
    <div class="left-part">
      <svg-base
        :iconName="isCollapse ? 'icon-color-zhankai' : 'icon-color-zhedie'"
        size="30"
        class="left-logo"
        @click="openAndClose"
      ></svg-base>
      <el-menu
        ref="menuRef"
        active-text-color="#ffd04b"
        background-color="rgb(38 46 65)"
        class="el-menu-vertical"
        :default-active="currentActive"
        text-color="#fff"
        :collapse="isCollapse"
      >
        <recursive-menu
            :menu-items="navigations"
            :is-first-level="true"
            :parent-path="''"
            @selectItem="handleSelect"
        />
      </el-menu>
    </div>
    <div class="right-part">
      <el-breadcrumb separator="/">
<!--        <el-breadcrumb-item>工作台</el-breadcrumb-item>-->
        <el-breadcrumb-item v-for="(route, index) in routeMatched" :key="index" :to="route.path">
          {{ route.meta.title || route.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref,watch } from 'vue'
import SvgBase from '@/components/SvgBase/index.vue'
import { useRouter,useRoute } from 'vue-router'
import recursiveMenu from './recursiveMenu.vue'
import TopView from './topBor/index.vue';
import { storeToRefs } from 'pinia';
import { usePermissionStore } from '@/store/modules/permission.ts';
const { getAddRoutes } = storeToRefs(usePermissionStore());
const navigations = computed(() => {
  return getAddRoutes.value;
});
const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => {
  return router.currentRoute.value
})
// 面包屑路由
const routeMatched = computed(() => {
  return route.matched.filter(
      record => !['Layout', '/layout'].includes(record.name?.toString() || '')
  )
})

const isCollapse = ref(false)
const openAndClose = () => {
  isCollapse.value = !isCollapse.value
}

const menuRef = ref(null)
const currentActive = ref(currentRoute.value.path)
// MenuSelectEvent

const handleSelect = (menu: any) => {
  currentActive.value = menu.path
  router.push(menu)
}
// 添加路由监听
watch(
    () => route.path,
    (newPath) => {
      currentActive.value = newPath
    },
    { immediate: true }
)
</script>
<style lang="postcss" >

.backend-setting {
  @apply  flex flex-row w-full;
  height: calc( 100% - 48px);
  overflow: hidden;

  > div {
    @apply h-full overflow-hidden;
    &.left-part {
      @apply max-w-[210px] relative flex flex-col overflow-y-auto;
      background-color: rgb(38 46 65);
      /* 自定义滚动条样式 */
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      /* 确保内容宽度固定，考虑滚动条宽度 */
      width: 210px;
      box-sizing: border-box;
      .el-menu {
        @apply border-none flex-1;
        width: 100%;
      }
      .left-logo {
        @apply absolute right-2 bottom-4;
      }
    }
    &.right-part {
      @apply p-4 pt-2 flex-1 flex flex-col;
      background-color: rgb(242 242 246);
      .el-breadcrumb {
        @apply mb-2;
      }
    }
  }
}
</style>
