<!--
 * @Author: lihuihui
 * @Date: 2025-03-04 16:32:28
 * @LastEditors: 杨浩 1015776826@qq.com
 * @LastEditTime: 2025-06-23 14:43:34
 * @Description: 修改密码页
-->
<template>
  <LoginPage :isH5="isH5">
    <template #rightForm>
      <div class="login-form">
        <h2>{{ t('CHANGE_PASSWORD') }}</h2>
        <el-form ref="formRef" :model="passwordData" :rules="rules" hide-required-asterisk label-position="top" @submit.native.prevent="handleSubmit">
          <el-form-item :label="t('OLD_PASSWORD')" prop="oldPassword">
            <el-input :placeholder="t('INPUT_PLACEHOLDER_COMMON')" size="large" v-model="passwordData.oldPassword" type="password" show-password>
              <template #prefix>
                <el-icon class="el-input__icon"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="t('NEW_PASSWORD')" prop="newPassword">
            <el-input :placeholder="t('INPUT_PLACEHOLDER_COMMON')" size="large" v-model="passwordData.newPassword" type="password" show-password>
              <template #prefix>
                <el-icon class="el-input__icon"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="t('CONFIRM_NEW_PASSWORD')" prop="confirmPassword">
            <el-input :placeholder="t('INPUT_PLACEHOLDER_COMMON')" size="large" v-model="passwordData.confirmPassword" type="password" show-password>
              <template #prefix>
                <el-icon class="el-input__icon"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="handleSubmit">{{ t('SUBMIT') }}</el-button>
            <el-button size="large" @click="handleCancel">{{ t('CANCEL') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </LoginPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginPage from '@/components/LoginPage/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Lock } from '@element-plus/icons-vue'
// import { updatePassword } from '@/api/login'
import { logout } from '@/utils/logout'
import { ElMessageBox, ElMessage } from 'element-plus'

declare global {
  interface Window {
    uni: any
  }
}

const { t } = useI18n()
const isH5 = ref(false)
const formRef = ref()
const router = new (useRouter as any)()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const passwordData = ref({
  username: userInfo?.value?.username,
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = ref({
  oldPassword: [{ required: true, message: '请填写旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请填写新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能小于8位', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur',
    },
    {
      validator: (_rule: any, value: string) => {
        return value !== passwordData.value.oldPassword
      },
      message: '旧密码和新密码相同',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请填写确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        return value === passwordData.value.newPassword
      },
      message: '两次密码不一致',
      trigger: 'blur',
    },
  ],
})

const handleCancel = () => {
  // 不修改了退回到首页
  router.push('/')
}
const handleChange = () => {
  // updatePassword(passwordData.value)
  //   .then((res: any) => {
  //     console.log('修改密码', res)
  //     if (res.success) {
  //       // 修改成功，跳转到登录页
  //       ElMessageBox.confirm('修改密码成功，请重新登录', '', {
  //         confirmButtonText: '确定',
  //         cancelButtonText: '取消',
  //         type: 'success',
  //         showClose: false,
  //         center: true,
  //       })
  //         .then(() => {
  //           // 清除登录状态
  //           logout(appStore.getTenantId)
  //           // 跳转到登录页
  //           router.push({ path: '/login' })
  //         })
  //         .catch(() => {})
  //     } else {
  //       // 修改失败，提示错误信息
  //       ElMessage.error(res.message)
  //     }
  //   })
  //   .catch((error: any) => {
  //     console.error('修改密码失败', error)
  //     ElMessage.error('修改密码失败，请稍后再试')
  //   })
}

const handleSubmit = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      handleChange()
    }
  })
}

// 切换语言
appStore.getSetLocale()
</script>

<style lang="scss" scoped>
.login-form {
  :deep(.el-form) {
    font-size: 20px;
  }
  > h2 {
    margin: 0;
    margin-bottom: 20px;
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
}
</style>
