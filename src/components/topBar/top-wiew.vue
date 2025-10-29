<template>
  <div class="hander-contaienr">
    <div class="hander-contaienr-wrap">
      <img class="nav-img" :class="{ showPointer: !isIframe }" :src="isIframe ? BkLogo : Logo" @click="logohander" />
      <div class="menu-content">
        <ul class="menu-ui">
          <li
            v-for="(item, index) in menuList"
            @click="changeMenu(item)"
            :class="{ 'is-active': item.key === currentRoute.path }"
            :key="index"
          >
            {{ item.label }}
          </li>
        </ul>
        <div class="item">
          <svg-base iconName="icon-color-shezhi" size="30" class="mr-2" @click="backendSetting"></svg-base>
          <el-popover placement="bottom" :width="50" trigger="click" v-model:visible="visible">
            <template #reference>
              <div class="flex flex-row items-center cursor-pointer">
                <img
                  src="@/assets/images/top_view/avatar.png"
                  style="width: 30px; height: 30px; border-radius: 50%"
                  alt=""
                />
                <span class="px-2">用户名</span>
                <svg-base iconName="icon-color-xiala-copy" size="14"></svg-base>
              </div>
            </template>
            <div
              class="cursor-pointer px-2 py-1 h-[40px] leading-[40px]"
              v-for="(item, index) in operateList"
              @click="handleOperate(item)"
              :key="index"
            >
              {{ item.label }}
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import SvgBase from '@/components/SvgBase/index.vue'
import TypeInfo from '@/hooks/dataType'
import TokenInfo from '@/hooks/tokenStatus'
import Logo from '@/assets/images/top_view/logo.png'
import BkLogo from '@/assets/images/top_view/bewgLogo.png'

const { dataType, setTypeFn } = TypeInfo()
const route = useRoute()
const { token } = TokenInfo()
const tokenStatus = computed(() => {
  return token.value || ''
})
const isIframe = computed(() => {
  return window !== window.parent
})

// 目录列表
const menuList = ref([
  {
    label: '模型',
    key: '/model-list'
  },
  {
    label: '数据集',
    key: '/data-list'
  },
  {
    label: 'Model Olympiad Park',
    key: '/model-park'
  }
  // {
  //   label: '模型开发',
  //   key: 'model-develop'
  // }
])

const visible = ref(false)
// 目录的点击事件
const router = useRouter()
const currentRoute = computed(() => {
  return router.currentRoute.value
})
console.log('currentRoute', currentRoute.value)
const changeMenu = (item) => {
  // setTypeFn(item)
  router.push({
    path: item.key
  })
}
// 用户下拉列表
const operateList = ref([
  {
    label: '我的模型',
    data: menuList.value[0]
  },
  {
    label: '我的数据集',
    data: menuList.value[1]
  }
])
const handleOperate = (operaItem) => {
  // 隐藏tooltip
  visible.value = false
}
const backendSetting = () => {
  setTypeFn({
    label: '',
    key: ''
  })
  // router.push('/backend-settings')
  router.push('/data-sandbox')
}
// 点击logo是否跳转
const logohander = () => {
  // if (window === window.parent) {
  //   window.location.href = 'http://121.36.71.254:8080/'
  // }
}
// router.beforeEach((to, from, next) => {
//   if (tokenStatus.value || (to.path !== '/assets-list' && to.path !== '/backend-settings' && to.path !== '/edit-detail')) {
//     next()
//   } else {
//     ElMessage.warning('暂无权限查看')
//   }WWW
// })
</script>
<style lang="postcss">
.hander-contaienr {
  @apply h-[66px] w-full p-0 px-[60px] bg-white relative top-0 left-0 z-50;
  border-bottom: 1px solid #dfe1e6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  .hander-contaienr-wrap {
    @apply h-[65px] p-0 m-0 mx-auto items-center w-full flex flex-row justify-between;
    /* min-w-[1280px] max-w-[1600px] */
    .nav-img {
      @apply inline-flex h-[38px];
      &.showPointer {
        @apply cursor-pointer;
      }
    }
    .menu-content {
      @apply flex-1 inline-flex justify-between pl-[90px];
      .menu-ui {
        @apply flex flex-row;
        > li {
          @apply inline-flex px-[18px] text-sm  h-[65px] leading-[65px] relative cursor-pointer;
          color: #191919;
          &:after {
            @apply absolute bottom-[1px] block;
            content: '';
            width: calc(100% - 36px);
            height: 2px;
            background: transparent;
          }
          &.is-active {
            &:after {
              @apply absolute bottom-0 block;
              background: #595959;
            }
          }
        }
      }
      .item {
        @apply flex flex-row items-center px-4;
        &:not(:last-child) {
          border-right-color: #333;
          border-right-width: 2px;
        }
      }
    }
  }
}
</style>
