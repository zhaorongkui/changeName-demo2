
<template>
  <div class="bgView">
    <div class="leftView">
      <img v-if="systemLogo" class="navIcon" :src="systemLogo" />
      <span>{{ systemName }}</span>
    </div>
    <div class="rightView">
      <!-- 消息通知弹框 -->
      <!-- <div class="item">
        <el-popover
          placement="bottom"
          :width="400"
          :visible="messageNotiShow"
          trigger="click"
          @hide="resetNotiPopover"
          @update:visible="
            (val) => {
              messageNotiShow = val;
            }
          "
        >
          <template #reference>
            <div class="notification">
              <svg-icon icon-name="icon-color-daohanglan-tongzhi" size="25" tooltip-content="消息通知"> </svg-icon>
              <div v-if="messageCount + todoCount > 0" class="messageNumber">
                {{ messageCount + todoCount > 999 ? '999+' : messageCount + todoCount }}
              </div>
            </div>
          </template>
          <message-notification
            :doto-count="todoCount"
            :message-count="messageCount"
            @push-to-un-read="messageNotiShow = false"
            @showlist="messageNotiShow = false"
          >
          </message-notification>
        </el-popover>
      </div> -->
      <!-- 主题切换 -->
<!--      <div class="item"><ThemeSwitch /></div>-->
<!--      <el-divider direction="vertical" class="layoutLine" />-->
      <!-- 语言切换 -->
      <div class="item">
<!--        <el-dropdown popper-class="dropDownStyle" @command="handleCommandLanguage">-->
<!--          <span class="el-dropdown-img pointer">-->
<!--            <img v-show="getLanguage === 'en-US'" src="@/assets/images/top_view/lang_en.png" />-->
<!--            <img v-show="getLanguage === 'zh-CN'" src="@/assets/images/top_view/lang_zh.png" />-->
<!--          </span>-->
<!--          <template #dropdown>-->
<!--            <el-dropdown-menu>-->
<!--              <el-dropdown-item command="zh-CN" :disabled="getLanguage === 'zh-CN'">简体中文</el-dropdown-item>-->
<!--              <el-dropdown-item command="en-US" :disabled="getLanguage === 'en-US'">English</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--          </template>-->
<!--        </el-dropdown>-->
      </div>
      <!-- 用户弹框 -->
      <div class="item lastItem">
        <el-popover placement="bottom" :width="50" trigger="click">
          <template #reference>
            <div class="pointer user-info">
              <div class="avatar">
                <img v-if="userInfo!?.avatar" :src="userInfo!?.avatar as string" alt="" />
                <img v-else src="@/assets/images/top_view/avatar.png" alt="" />
              </div>
              <span style="padding: 0 5px">{{ userInfo!?.name }}</span>
              <svgBase icon-name="icon-color-xiala-copy" size="14"> </svgBase>
            </div>
          </template>
          <div
              v-for="(userItem, i) in TOPVIEW_TAGS_USER_POPS"
              :key="i"
              :class="['userDrop', 'pointer']"
              @click="handleOperate(userItem as any)"
          >
            {{ userItem }}
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed,onUnmounted,onMounted} from 'vue'
import { useAppStore } from '@/store/modules/app';
import { logout } from '@/utils/logout';
import  svgBase from '@/components/SvgBase/index.vue'
// import { updateLocale } from '@/service/login';
import * as buses from '@/utils/bus.ts';
// import WujieVue from 'wujie-vue3';
import { useRouter } from 'vue-router';
const router = useRouter();
const appStore = useAppStore();
// appStore.getProductConfig();
const TOPVIEW_TAGS_USER_POPS = ['退出登录'];
// const messageNotiShow = ref<null | boolean>(null);
// 获取用户信息
const userInfo = computed(() => appStore.getUserInfo || null);
// 获取语言信息
// const { getLanguage } = storeToRefs(appStore);
// 切换语言
const handleCommandLanguage = async (command: string) => {
  // appStore.setLanguage(command);
  // bus.$emit('languageChange', command);
};
const systemName = computed(() => {
  return '模型实验室'
  // return appStore.productionConfig.systemName || '模型沙箱';
});
const systemLogo = computed(() => {
  // return appStore.productionConfig.systemLogo
  return appStore.productionConfig.systemLogo;
});

// const messageCount = ref(0);
// const todoCount = ref(0);
// onMounted(() => {
//   getNotificationCount();
//   buses.bus.on(buses.MESSAGE_STATE_CHANGE, () => {
//     getNotificationCount();
//   });
//   buses.bus.on(buses.MESSAGE_SSE_NOTIFICATION_CHANGE, () => {
//     getNotificationCount();
//   });
// });
onUnmounted(() => {
  buses.bus.off(buses.MESSAGE_STATE_CHANGE);
  buses.bus.off(buses.MESSAGE_SSE_NOTIFICATION_CHANGE);
});

//获取消息数量通知
// const getNotificationCount = async () => {
//   const todocount = await getMessageCountApi(1);
//   const messagecount = await getMessageCountApi(3);
//   if (todocount && todocount.success) {
//     todoCount.value = todocount.data;
//   }
//   if (messagecount && messagecount.success) {
//     messageCount.value = messagecount.data;
//   }
// };
// 重置消息popver
// const resetNotiPopover = () => {
//   messageNotiShow.value = null;
// };

// 登出
const handleOperate = (userItem: string) => {
  if (['退出登录', 'Logout'].includes(userItem)) {
    logout(appStore.getTenantId);
  }
  if (['Change password', '修改密码'].includes(userItem)) {
    // 修改密码
    router.push({
      path: '/changePassword',
    });
  }
};
</script>
<style lang="scss" scoped>
@use '@/style/home.scss';
.bgView {
  width: 100%;
  height: $headerHeight;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  margin-left: auto;
  background-color: $primary-color;

  .leftView {
    display: flex;
    width: 50%;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    margin-left: 20px;

    .navIcon {
      margin-left: 6px;
      height: 30px;
      margin-right: 10px;
    }

    .workbenchNav {
      margin-left: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 6px;
      position: relative;
      font-size: $fs-14;
      border-radius: $mainBorderRadius;
      &:before {
        content: '';
        position: absolute;
        top: 10%;
        left: -16px;
        width: 1px;
        height: 80%;
        background: rgba(255, 255, 255, 0.4);
      }

      // &:after {
      //   content: '';
      //   position: absolute;
      //   top: 0;
      //   right: 0;
      //   width: 1px;
      //   height: 100%;
      //   background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
      // }

      &-label {
        margin: 0 10px;
        width: max-content;
        transition: all ease 0.2s;

        &.active {
          background-color: #feb453;
        }
      }

      &-icon {
        transition: all ease 0.2s;

        &.turn {
          transform: rotateZ(180deg);
        }
      }
    }
    .activebg {
      background-color: #feb453;
    }
  }

  .rightView {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;

    .item {
      width: fit-content;
      height: 60%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10px;
    }
  }
  .lastItem {
    // border-right: 0px solid;
    width: fit-content;
    margin: 0;
    margin-left: 12px;
    .user-info {
      margin-right: 16px;
      display: flex;
      align-items: center;
      font-size: $fs-14;
    }
    .user-info:hover {
      background-color: rgba(0, 0, 0, 0.07);
      border-radius: $mainBorderRadius;
    }

    .avatar {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: $mainBorderRadius;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;

      > img {
        width: 70%;
        height: 70%;
      }
    }
  }

  .el-dropdown-img {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      width: 26px;
      height: 26px;
      padding: 5px;
    }
    &:focus-visible {
      outline: none;
    }
  }
  .el-dropdown-img :hover {
    background-color: rgba(0, 0, 0, 0.07);

    border-radius: $mainBorderRadius;
  }

  .userName {
    display: flex;
    justify-content: center;
    flex-direction: column;

    .item {
      width: 100%;
      height: 2rem;
      text-align: center;
    }
  }

  .notification {
    position: relative;
    display: flex;
    align-items: center;
    .messageNumber {
      position: absolute;
      top: -2px;
      right: -15px;
      width: 30px;
      height: 15px;
      border-radius: 20px;
      background-color: #f44c4c;
      color: white;
      text-align: center;
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
:deep(.el-input) {
  // --el-input-border-color: #358DF8 !important;
  margin-right: 8px;
}
:deep(.el-input__wrapper) {
  border-radius: $mainBorderRadius;
  background: $primary-color;
  color: #ffffff;
  border: 0px solid #ffffff;
}
:deep(.el-input__inner) {
  color: #ffffff;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

:global(.dropDownStyle .el-dropdown-menu__item:hover) {
  background-color: $mainHover !important;
}

:global(.dropDownStyle .el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: $mainHover !important;
}

.userDrop {
  text-align: center;
  height: 32px;
  line-height: 32px;
  font-size: $fs-14;
  color: $mainContentText;
  font-weight: 500 !important;
}
.userDrop:hover {
  background: $mainHover;
  border-radius: $mainBorderRadius;
}
</style>
