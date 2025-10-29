<template>
  <div :class="['login', isH5 ? 'app' : 'pc']">
    <header class="header" v-if="!isH5">
      <div class="header-left">
        <img src="@/assets/images/login/logo.webp" alt="" />
      </div>
      <!-- <div class="header-right">
        <span>{{ t('LOGIN_DOWNLOAD') }}</span>
        <span>{{ t('LOGIN_DOC') }}</span>
      </div> -->
    </header>
    <main class="main">
      <div v-if="isH5" class="login-header">
        <div class="welcome">
          <div class="welcome-h1">
            <span class="welcome-h1-text">欢迎使用</span>
            <img class="welcome-h1-logo" src="@/assets/images/login/small-logo.png" srcset="@/assets/images/login/small-logo@2x.png, @/assets/images/login/small-logo@3x.png"  alt="logo"></img>
          </div>
          <!-- TODO: 平台名字需要后续改为管理后台配置的文字 -->
          <div class="welcome-h2">污水运营管理平台</div>
        </div>
      </div>
      <div class="main-right">
        <slot name="rightForm"></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
defineProps({
  isH5: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.login.pc {
  // 增加背景图片的加载速度
  background-image: url('@/assets/images/login/BG.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position:
      35%,
      50%;
}
.login {
  width: 100%;
  height: 100vh;
  .header {
    width: 100%;
    height: 48px;
    padding: 0 24px 0 16px;
    box-sizing: border-box;
    color: #ffffff;

    display: flex;
    align-items: center;
    justify-content: space-between;
    &-left {
      font-size: 16px;
      display: flex;
      align-items: center;
      font-weight: 500;
      > img {
        position: fixed;
        width: 5vw;
        min-width: 100px;
        left: 20px;
        top: 20px;
      }
    }
    &-right {
      font-size: 14px;
      display: flex;
      align-items: center;
      border-radius: 24px;
      > span {
        margin-left: 20px;
        cursor: pointer;
      }
      .el-dropdown-img {
        width: 26px;
        height: 26px;
        margin-left: 20px;
        > img {
          width: 26px;
          height: 26px;
        }
        &:focus-visible {
          outline: none;
        }
      }
    }
  }
  .main {
    width: 100%;
    height: calc(100vh - 64px);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &-right {
      width: 500px;
      height: 566px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 4px;
      position: relative;
    }
  }
}
.app.login {
  position: relative;
  .main {
    display: flex;
    position: relative;
    flex-direction: column;
    padding: 0;
    height: 100%;
    overflow: hidden;
    justify-content: center;
    background-image: url('@/assets/images/login/BG-app.png');
    background-size: 100% auto;
    background-repeat: no-repeat;

    .login-header {
      position: absolute;
      flex: 1;
      min-height: 200px;
      top: 0;
      height: 100%;
      width: 100vw;
      .welcome {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        &-h1 {
          position: absolute;
          left: 30px;
          bottom: calc(77% + 36px);
          &-text {
            font-size: 30px;
            line-height: 32px;
            width: fit-content;
          }
          &-logo {
            vertical-align: middle;
            margin-left: 5px;
            height: 30px;
            margin-bottom: 10px;
          }
        }
        &-h2 {
          position: absolute;
          left: 30px;
          bottom: calc(77% + 20px);
          font-size: 16px;
        }
      }
    }
    .main-right {
      position: absolute;
      bottom: 0;
      margin: 0;
      width: 100%;
      height: 77%;
      padding: 0 28px;
      border-radius: 24px 24px 0 0;
    }
  }
}
@media screen and (max-width: 800px) {
  .login.pc {
    // 增加背景图片的加载速度
    background-attachment: fixed;
  }
  .main {
    justify-content: center !important;
    padding: 0 !important;
    margin: auto;
    overflow: auto;
  }
}
@media screen and (min-width: 800px) {
  .login.pc {
    background-attachment: fixed;
  }
  .main {
    padding-right: 60px;
  }
}
@media screen and (min-width: 1440px) {
  .main {
    padding-right: 100px;
  }
}
@media screen and (min-width: 1920px) {
  .login.pc {
    background-image: url('@/assets/images/login/BG.webp'), url('@/assets/images/login/BG@2x.png');
  }
  .main {
    padding-right: 260px;
  }
}
</style>
