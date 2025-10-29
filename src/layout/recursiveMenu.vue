<template>
  <template v-for="item in menuItems" :key="item.path">
    <!-- 有子菜单的情况 -->
    <el-sub-menu
        v-if="item.children && item.children.length && item.detail != 1"
        :index="getFullPath(item.path)"
    >
      <template #title>
        <!-- 只有第一级菜单才显示图标 -->
        <el-icon v-if="isFirstLevel && item.meta?.icon">
          <svg-base :iconName="item.meta.icon" size="30"></svg-base>
        </el-icon>
        <span>{{ item.meta?.title || item.title }}</span>
      </template>

      <!-- 递归调用子菜单，传递完整父路径 -->
      <recursive-menu
          :menu-items="filterChildren(item.children)"
          :is-first-level="false"
          :parent-path="getFullPath(item.path)"
          @selectItem="(item) => emit('selectItem', item)"
      />
    </el-sub-menu>

    <!-- 没有子菜单的情况 -->
    <el-menu-item
        v-else
        :index="getFullPath(item.path)"
        @click="handleSelect(item)"
    >
      <!-- 只有第一级菜单才显示图标 -->
      <el-icon v-if="isFirstLevel && item.meta?.icon">
        <svg-base :iconName="item.meta.icon" size="30"></svg-base>
      </el-icon>
      <span>{{ item.meta?.title || item.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import SvgBase from '@/components/SvgBase/index.vue'

// 定义 props（新增 parentPath）
const props = defineProps<{
  menuItems: Array<{
    path: string
    meta: {
      title: string
      icon?: string
      hidden?: boolean
      auth?: boolean
    }
    children?: any[]
  }>,
  isFirstLevel?: boolean // 是否为第一级菜单
  parentPath?: string // 父菜单的完整路径，用于拼接子路径
}>()

// 默认值处理
const isFirstLevel = props.isFirstLevel ?? true
const parentPath = props.parentPath ?? ''

// 定义事件
const emit = defineEmits(['selectItem'])

// 过滤隐藏的子菜单
const filterChildren = (children?: any[]) => {
  return children?.filter(item => !item.meta?.hidden) || []
}

// 生成完整路径（核心：拼接父路径和当前路径）
const getFullPath = (currentPath: string) => {
  // 如果当前路径是绝对路径（以 / 开头），直接返回
  if (currentPath.startsWith('/')) {
    return currentPath
  }
  // 否则拼接父路径（处理斜杠重复问题）
  const base = parentPath.endsWith('/') ? parentPath : `${parentPath}/`
  return `${base}${currentPath}`
}

// 菜单项点击：传递包含完整路径的item
const handleSelect = (item: any) => {
  const fullPathItem = {
    ...item,
    path: getFullPath(item.path) // 覆盖为完整路径
  }
  emit('selectItem', fullPathItem)
}
</script>