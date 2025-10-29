<template>
  <LoginPage v-if="!isSSO" :isH5="isH5">
    <template #rightForm>
      <div v-if="!isH5" class="login-form">
        <header>
          <div class="login-step">① 企业登录</div>
          <div class="divider"></div>
          <div class="account-step">② 账号登录</div>
        </header>
        <!-- <el-dropdown v-if="!isH5" @command="handleCommandLanguage" class="lang-drop">
          <span class="el-dropdown-link pointer">
            {{ appStore.getLanguage == 'en-US' ? 'English' : '简体中文' }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh-CN" :disabled="appStore.getLanguage == 'zh-CN'">简体中文</el-dropdown-item>
              <el-dropdown-item command="en-US" :disabled="appStore.getLanguage == 'en-US'">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <main>
          <div class="login-welcome"><span> 欢迎使用模型实验室管理系统 </span><img class="logo" src="@/assets/images/login/small-logo@2x.png" alt="" /></div>
          <el-form class="main-form" ref="tenantRef" :model="tenantData" :rules="rules" hide-required-asterisk label-position="top" @submit.native.prevent="handleSubmit">
            <el-form-item prop="tenantId">
              <el-select :placeholder="t('ENTERPRISE_LOGIN_PLACEHOLDER')" size="large" filterable remote v-model="tenantData.tenantId" :remote-method="remoteMethod" :loading="selectLoading">
                <template #label="{ label }">
                  <span>{{ removeBrackets(label) }}</span>
                </template>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="agreement">
              <el-checkbox v-model="tenantData.agreement" style="font-size: 14px">
                我已阅读并同意
                <span href="" target="_blank" style="cursor: pointer; color: #065cdd; font-size: 14px" @click="openAgreementDialog">《用户协议与隐私声明》</span>
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button class="login-form-btn" size="large" @click="handleNextStep">{{ t('LOGIN_NEXT') }}</el-button>
            </el-form-item>
          </el-form>
        </main>
        <footer>
          <div>©2024-2025 杭州北水云服科技有限公司版权所有</div>
          <div>备案号：浙ICP备2024137043号</div>
        </footer>
      </div>
      <div v-else class="app-form">
        <div class="form-title">{{ '1. ' + t('LOGIN_APP') }}</div>
        <el-form ref="tenantRef" :model="tenantData" :rules="rules" hide-required-asterisk label-position="top" @submit.native.prevent="handleNextStep">
          <el-form-item prop="tenantId">
            <el-select
              :placeholder="t('ENTERPRISE_LOGIN_PLACEHOLDER')"
              size="large"
              filterable
              remote
              v-model="tenantData.tenantId"
              :remote-method="remoteMethod"
              :loading="selectLoading"
              popper-class="login-select-options"
            >
              <template #label="{ label }">
                <span>{{ removeBrackets(label) }}</span>
              </template>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="agreement">
            <el-checkbox v-model="tenantData.agreement" style="font-size: 14px">
              我已阅读并同意
              <span target="_blank" style="cursor: pointer; color: #065cdd; font-size: 14px" @click="openAgreementDialog">《忠虫网平台用户服务协议》</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button class="app-form-btn" size="large" @click="handleNextStep">{{ t('LOGIN_NEXT') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </LoginPage>
  <AgreementDialog v-model:show="showAgreement"></AgreementDialog>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted ,onBeforeMount } from 'vue'
import LoginPage from '@/components/LoginPage/index.vue'
import { useRouter } from 'vue-router'
import { removeToken } from '@/utils/auth'
import { checkTenant } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from 'vue-i18n'
import { getUrlParamsStrong } from '@/utils/index'
import { isUni } from '@/utils/index'
import { PRODUCT_ID } from '@/constants/config'
import { remoteTenant } from '@/api/login'
import AgreementDialog from './AgreementDialog.vue'
const { t } = useI18n()
const isH5 = ref(false)
const isSSO = ref(false)
const tenantParam = ref('')
const tenantData = ref({
  tenantId: '',
  agreement: false,
})
const showAgreement = ref(false)
const checkId = async (_rule: any, value: any, callback: any) => {
  if (value) {
    const isExist = await checkTenantId()
    if (!isExist) {
      callback(new Error('租户ID不存在，请重新确认'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 处理登录
const handleLogin = () => {
  console.log(redirectUrl.value,'redirectUrl.value======')
  let env = process.env.NODE_ENV
  let BASE_API = projectEnv.VITE_APP_MODEL_SANDBOX
  const tenantId = isSSO.value ? tenantParam.value : tenantData.value.tenantId
  console.log(env,tenantId,location.origin)
  if (env === 'development') {
    BASE_API = 'http://10.195.6.251:15000'
  }
  const encodedTarget = safeBase64Encode(redirectUrl.value)
  window.localStorage.setItem('tenantId', tenantId)
  console.log('登录页',`${BASE_API}/login/signin?tenantId=${tenantId}&productId=${PRODUCT_ID}&target=${encodedTarget}`,)
  // 访问后端服务通过后端服务返回重定向登录界面
  window.location.href = `${BASE_API}/login/signin?tenantId=${tenantId}&productId=${PRODUCT_ID}&target=${encodedTarget}`
}

const openAgreementDialog = () => {
  showAgreement.value = true
}

const rules = ref({
  tenantId: [
    { required: true, message: '租户ID不能为空', trigger: 'blur' },
    { validator: checkId, message: '租户不存在或没有生效的租约', trigger: 'blur' },
  ],
  agreement: [
    {
      required: true,
      validator: (_rule: any, value: any, callback: any) => {
        if (!value) {
          callback(new Error('请阅读并同意服务协议和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
})
// 检查租户是否存在
const checkTenantId = async () => {
  if (!tenantData.value.tenantId && !isSSO.value) return false
  const { data } = await checkTenant({
    tenantId: isSSO.value ? tenantParam.value : tenantData.value.tenantId,
  })
  return data
}
// 登录搜索租户相关逻辑
const selectLoading = ref(false)
const options = ref<any[]>([])
const router = new (useRouter as any)()
const projectEnv: any = inject('$projectEnv')
const tenantRef = ref()
// 切换语言
const appStore = useAppStore()
// appStore.getSetLocale()

// 校验是否存在租户
const checkThenLogin = async () => {
  const isExist = await checkTenantId()
  if (isExist) {
    const loginTriedTimes = JSON.parse(localStorage.getItem('loginTriedTimes') || '0')
    if (loginTriedTimes >= 3) {
      localStorage.setItem('loginTriedTimes', JSON.stringify(0))
      window.localStorage.removeItem('tenantId')
      router.push('/')
    } else {
      localStorage.setItem('loginTriedTimes', JSON.stringify(loginTriedTimes + 1))
    }
    removeToken()
    handleLogin()
  } else {
    isSSO.value = false
    tenantParam.value = ''
  }
}

const removeBrackets = label => {
  return label.replace(/（[^）]*）/, '') // 正则匹配括号及其中内容
}
const remoteMethod = (query: string) => {
  if (query) {
    selectLoading.value = true
    remoteTenant(query)
      .then(res => {
        const { data } = res
        options.value = data.map((item: any) => {
          return {
            value: item.tenantId,
            label: item.tenantName ? `${item.tenantName}（${item.tenantId}）` : item.tenantId,
          }
        })
      })
      .catch(err => {
        console.error('获取租户列表失败', JSON.stringify(err))
      })
      .finally(() => {
        selectLoading.value = false
      })
  }
}
// 检查 SSO 登录 是否携带参数tenant
const checkSSO = async () => {
  // 重定向的path
  const params = getUrlParamsStrong(window.location.href)
  window.localStorage.setItem('checkSSO_road', JSON.stringify(params))
  const isBack = params?.isBack && params.isBack === '1'
  const localTenant = params?.tenant || localStorage.getItem('tenantId')
  if (localTenant && !isBack) {
    isSSO.value = true
    tenantParam.value = localTenant
    await checkThenLogin()
  } else if (localTenant && isBack) {
    try {
      // 从登录页返回的, 直接填充上次的登录信息
      isSSO.value = false
      remoteMethod(localTenant)
      tenantData.value.tenantId = localTenant
      tenantData.value.agreement = true
    } catch {
      isSSO.value = false
      tenantData.value.tenantId = ''
      tenantData.value.agreement = false
      tenantParam.value = ''
    }
  } else {
    isSSO.value = false
    tenantParam.value = ''
  }
}
// 处理redirectUrl
const redirectUrl = computed(() => {
  if (isH5.value) {
    return `${window.location.origin}/app_index.html` // 如果是h5页面, 跳转到app的跳转页
  } else {
    // 优雅处理 query 参数，避免 undefined 的情况
    const redirectQuery = router.currentRoute.value.query?.redirect
    let redirectPath = '/'
    if (redirectQuery && typeof redirectQuery === 'string') {
      try {
        const urlDecode = decodeURIComponent(redirectQuery)
        redirectPath = urlDecode
      } catch (error) {
        console.warn('URL decode failed, using default path:', error)
        redirectPath = '/'
      }
    }
    return `${window.location.origin}/#${redirectPath}`
  }
})

onBeforeMount(() => {
  checkSSO()
})

onMounted(() => {
  isH5.value = isRunningInUniappH5()
  document.addEventListener('UniAppJSBridgeReady', function () {
    if (!isH5.value) {
      // 进入这个方法再验证一次
      isH5.value = isRunningInUniappH5()
    }
  })
})
function isRunningInUniappH5() {
  const params = getUrlParamsStrong(window.location.href)
  const localH5 = localStorage.getItem('isH5')
  if (params?.platform === 'app' || isUni()) {
    localStorage.setItem('isH5', 'true')
    return true
  } else if (localH5 && JSON.parse(localH5)) {
    return true
  } else {
    try {
      window.uni.getEnv(function (res) {
        if (res?.plus) {
          // 在这里调用 postMessage
          localStorage.setItem('isH5', 'true')
          return true
        } else {
          return false
        }
      })
    } catch (error) {
      return false
    }
  }
  return false // 确保函数总是返回一个布尔值
}

// 安全的 base64 编码函数，支持 Unicode 字符
const safeBase64Encode = (str: string): string => {
  try {
    // 先将字符串转换为 UTF-8 编码的字节数组
    const utf8Bytes = new TextEncoder().encode(str)
    console.log('utf8Bytes', utf8Bytes)
    // 将字节数组转换为 base64
    let base64 = btoa(String.fromCharCode(...utf8Bytes))

    // 替换为 URL 安全的 base64
    // base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return base64
  } catch (error) {
    console.warn('Base64 encoding failed, using fallback:', error)
    // 如果编码失败，返回一个安全的默认值
    return btoa('/')
  }
}

const handleNextStep = () => {
  tenantRef.value.validate(async (valid: boolean) => {
    if (valid) {
      removeToken()
      handleLogin()
    }
  })
}

const handleSubmit = () => {
  handleNextStep()
}
// const handleCommandLanguage = async (command: string) => {
//   // console.log(command);
//   // language.value = command == 'zh-CN' ? 'ch' : 'en';
//   await updateLocale(command)
//   appStore.setLanguage(command)
// }
</script>
<style lang="scss">
.login-select-options {
  .el-select-dropdown__wrap {
    max-height: 136px !important; // app端下拉框太长, 键盘弹出会出现滚动条
  }
}
/* 添加必要的样式 */
.agreement-checkbox {
  margin: 30px 0;
  font-size: 14px;
}

.agreement-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
}

.agreement-link {
  color: #065cdd;
  text-decoration: none;
  font-size: 14px;
}

.agreement-link:hover {
  text-decoration: underline;
}
</style>
<style lang="scss" scoped>
.app-form {
  padding: 25px 0 20px;
  .form-title {
    text-align: center;
    font-size: 16px;
    padding-bottom: 40px;
  }
  :deep(.app-form-btn) {
    margin-top: 20px;
    height: 48px;
    line-height: 48px;
    width: 100%;
    border-radius: 24px !important;
    font-size: 16px;
    background-color: #065cdd;
    border-color: #065cdd;
    color: #ffffff;
  }
  :deep(.el-select .el-select__wrapper) {
    border-radius: 6px !important;
    box-shadow: none !important;
    height: 44px;
  }
  .el-select__wrapper.is-focused {
    box-shadow: none !important;
  }
  :deep(.el-select__wrapper) {
    background: #eff2f7 !important;
    margin: 0 !important;
  }
  :deep(.el-select__placeholder.is-transparent) {
    color: rgba($color: #172b4d, $alpha: 0.6) !important;
  }
  :deep(.el-select__input) {
    margin-left: 0;
  }
}
.login-form {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.el-form) {
    font-size: 20px;
  }

  .lang-drop {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
  }

  &-btn {
    width: 100%;
    background-color: $color_primary;
    border-color: $color_primary;
    color: #ffffff;
    margin-top: 10px;
  }

  > header {
    height: 65px;
    display: flex;
    align-items: center;
    padding: 0 80px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background-color: #e3e3e3;
    }

    .login-step {
      color: #065cdd;
      font-size: 18px;
      flex-shrink: 0;
    }

    .account-step {
      color: #172b4d;
      font-size: 18px;
      flex-shrink: 0;
    }

    .divider {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 25px;

      &::before {
        content: '';
        flex: 1;
        height: 1px;
        border-top: 1px solid #979797;
      }
    }
  }

  // Main 区域样式
  > main {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    .login-welcome {
      width: 100%;
      text-align: center;
      height: 46px;
      line-height: 46px;
      font-size: 24px;
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: center;
      .logo {
        width: 40px;
        margin-left: 10px;
      }
    }
    .main-form {
      margin: 40px 0;
      .login-form-btn {
        height: 54px;
        line-height: 54px;
      }
      :deep(.el-select__wrapper) {
        height: 48px;
        .el-select__input {
          margin: 0 !important;
        }
      }
    }
    > h2 {
      margin: 0;
      margin-bottom: 20px;
    }
  }

  // Footer 区域样式
  > footer {
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 12px;
    color: #666;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background-color: #e3e3e3;
    }
  }
}
</style>
