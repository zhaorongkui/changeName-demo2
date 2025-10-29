<!--
 * @Author: lihuihui
 * @Date: 2025-03-21 14:38:36
 * @LastEditors: 杨浩 1015776826@qq.com
 * @LastEditTime: 2025-07-08 15:53:48
 * @Description: 请填写简介
-->
<template>
  <div class="theme-switch">
    <el-popover width="266" popper-class="theme-switch__popper" @after-enter="popoverShowAfter">
      <template #reference>
        <div class="theme-item">
          <svg-base class="icon" icon-name="icon-color-dd" size="24" color="#fff"></svg-base>
          主题
        </div>
      </template>
      <div class="textContainer">
        <h4 class="text-md">多种颜色选择</h4>
        <span class="theme-block text-sm theme-text">{{ curText }}</span>
      </div>
      <div style="margin-top: 12px">
        <div ref="floatingRulerRef" class="floating-ruler" @mousedown="mousedown">
          <div ref="floatingCursorRef" class="cursor-wrap theme-bg theme-text" :style="cursorStyle"></div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed,onMounted,onUnmounted,reactive} from 'vue'
import useTheme, { type ThemeMode, themeColorList } from '@/hooks/theme';
const { fetchThemeMode, switchTheme, init } = useTheme();
const curMode = ref(fetchThemeMode());
const curText = computed(() => getThemeInfo(curMode.value)?.label ?? '');
// 游标css
const cursorStyle = computed(() => {
  return {
    transform: `translateX(${mouseState.cursorOffsetX}px)`,
  };
});
// 浮尺ref
const floatingRulerRef = ref<HTMLElement>();
// 游标
const floatingCursorRef = ref<HTMLElement>();
// 鼠标相关状态
const mouseState = reactive({
  // 距离屏幕的左偏移量
  offsetClientLeft: 0,
  // 游标x轴偏移量
  cursorOffsetX: 0,
  // 移动/暂停
  state: 'stop',
});

// 获取式对应信息
const getThemeInfo = (mode: ThemeMode) => {
  return themeColorList.find((item) => item.value === mode);
};
// 设置主题模式
const setMode = (mode: ThemeMode) => {
  if (mode === curMode.value) return;
  curMode.value = mode;
  switchTheme(mode);
};

const mousedown = (e: MouseEvent) => {
  mouseState.state = 'moving';
  // 禁止选中文字
  document.body.style.userSelect = 'none';
  const { offsetX, layerX } = e;

  if (e.target === floatingCursorRef.value) {
    mouseState.cursorOffsetX = layerX - 6;
    moveAfter(layerX);
  } else {
    mouseState.cursorOffsetX = offsetX - 6;
    moveAfter(offsetX);
  }
};
const mousemove = (e: MouseEvent) => {
  if (mouseState.state !== 'moving') return;
  const { clientX } = e;
  let left = clientX - mouseState.offsetClientLeft;

  if (left > 240) {
    left = 240;
  }
  if (left < 0) {
    left = 0;
  }
  mouseState.cursorOffsetX = left - 6;
  moveAfter(left);
};

const mouseup = () => {
  // 允许选中文字
  document.body.style.userSelect = 'auto';
  if (mouseState.state === 'moving') {
    mouseState.state = 'stop';
  }
};

const moveAfter = (x: number) => {
  if (x < 40) {
    setMode('default');
  } else if (x < 80) {
    setMode('red');
  } else if (x < 120) {
    setMode('green');
  } else if (x < 160) {
    setMode('orange');
  } else if (x < 200) {
    setMode('purple');
  } else if (x < 240) {
    setMode('darkblue');
  }
};

// popover弹出后触发
const popoverShowAfter = () => {
  // 获取距离屏幕的距离
  if (!floatingRulerRef.value) return;
  mouseState.offsetClientLeft = floatingRulerRef.value.getBoundingClientRect().left;
};

onMounted(() => {
  document.body.addEventListener('mousemove', mousemove);
  document.body.addEventListener('mouseup', mouseup);
  // 主题对应的偏移量初始值
  const modeX = {
    default: 0,
    red: 40,
    green: 80,
    orange: 120,
    purple: 160,
    darkblue: 200,
  };
  mouseState.cursorOffsetX = modeX[curMode.value];
  init();
});

onUnmounted(() => {
  document.body.removeEventListener('mousemove', mousemove);
  document.body.removeEventListener('mouseup', mouseup);
});
</script>

<style lang="scss" scoped>
.theme-switch {
  cursor: pointer;
  &__popper {
    .cursor-wrap {
      position: absolute;
      left: 0;
      top: 3px;
      width: 12px;
      height: 14px;
      border-radius: 1px;
      box-shadow: 0px 0px 2px 0px rgba(8, 71, 168, 0.6);
      &::before {
        display: block;
        position: absolute;
        overflow-x: auto;
        content: '';
        width: 0;
        height: 0;
        border-color: transparent transparent currentColor transparent;
        border-width: 6px;
        top: -12px;
        left: 0;
        z-index: 2;
        filter: drop-shadow(0px -1px 2px rgba(8, 71, 168, 0.3));
      }

      &::after {
        // @apply block bg-white rounded-full mx-auto relative;
        display: block;
        background-color: white;
        border-radius: 50%;
        position: relative;
        overflow-x: auto;
        content: '';
        width: 4px;
        height: 4px;
        margin-top: -2px;
        z-index: 3;
      }
    }
    .textContainer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .theme-block {
      display: flex;
      justify-items: center;
      position: relative;
      &::before {
        content: '';
        width: 4px;
        height: 20px;
        left: -8px;
        background: currentColor;
        position: absolute;
        display: block;
        // @apply absolute block;
      }
    }
    .floating-ruler {
      position: relative;
      display: flex;
      cursor: move;
      width: 240px;
      height: 10px;
      border-radius: 2px;
      background-image: linear-gradient(
              to right,
              blue 0px,
              blue 40px,
              red 40px,
              red 80px,
              green 80px,
              green 120px,
              orange 120px,
              orange 160px,
              purple 160px,
              purple 200px,
              darkblue 200px,
              darkblue 240px
      );
    }
  }
}
.theme-item {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}
.icon {
  margin-right: 5px;
}
</style>
