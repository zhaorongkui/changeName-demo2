<!--
 * @Author: lihuihui
 * @Date: 2025-03-21 14:17:48
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-03-28 14:56:46
 * @Description: 请填写简介
-->
<template>
  <svg v-if="!isShowHover" :class="svgClass" aria-hidden="true" :style="dynamicStyles">
    <use :href="iconClassName" :fill="color" />
  </svg>
  <div v-else class="svbBgView">
    <svg :class="svgClass" aria-hidden="true">
      <use :href="iconClassName" :fill="color" />
    </svg>
  </div>
</template>
<script setup lang="ts">
import {ref,computed} from 'vue'
const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#409eff',
  },
  size: {
    type: String,
    default: '20',
  },
  isShowHover: {
    type: Boolean,
    default: false,
  },
});
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`;
});
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return 'svg-icon';
});
// 使用计算属性来创建动态样式
const dynamicStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));
</script>
<style scoped lang="scss">
.svbBgView {
  border-radius: 4px;
  display: flex;
  align-items: center;
  :hover {
    background-color: rgba($color: #000000, $alpha: 0.03);
  }
}
.svg-icon {
  width: 24px;
  height: 24px;
  position: relative;
  vertical-align: -2px;
  fill: currentColor;
}
</style>
